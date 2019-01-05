/**
 * import Section
 */
import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import { withRouter } from "react-router";
import { httpGet } from '../../../services/https';
import { getUserDataFromLocalStorage } from '../../../services/helper';
import '../style.css';
import Sidebar from '../sidebar';
import Topbar from '../topbar';
import ENV from '../../../environment/env'
import { Table, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import moment from 'moment';
import Loader from '../../../Loader/loader'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
var numeral = require('numeral');


/**
 * Class Declaration
 */
class SettlementReports extends Component {
  _env = new ENV();
  user = {};
	/**
	 * state
	 */
  state = {
    hits: [],
    driverFiltered: [],
    driverFilteredUno: [],
    isOpen: false,
    dropdownOpen: false,
    selectedDay: undefined,
    from: undefined,
    to: undefined,
    date: new Date(),
    driverReportData: [],
    driverData: [],
    driver_id: 'all',
    terminal: 'all',
    start_del_date: '',
    end_del_date: '',
    page: 1,
    limit: 100,
    total: 0,
    isRequesting: false,
    tIds: []
  };

  sortNumber(a, b) {
    return a - b;
  }

  printDiv() {
    var divToPrint = document.getElementById('DivIdToPrint');
    html2canvas(divToPrint, { width: 2300, height: 3000 }).then(function (canvas) {
      var base64image = canvas.toDataURL("image/png");
      const doc = new jsPDF('', 'mm', [canvas.width, canvas.height]);
      doc.addImage(base64image, 'png', 0, 0, canvas.width / 2, canvas.height / 2);
      doc.save('report.pdf');         
    });     
  }
 

  /**
   * Get Drivers List
   */
  getDriversList() {
    this.setState({
      isRequesting: true
    })
    let url = '/fasttrac/drivers'
    url += '?page=' + this.state.page  
    url += '&limit=' + this.state.limit  
    httpGet(url).then((success) => {
      var arr = []
      var ids =[]
      this.setState({
        isRequesting: false
      })
      if (success.data.length <= 0) {
        return
      } else {
          if (this.state.tIds.length > 0) {
            ids = this.state.tIds
            success.data.forEach((val, i) => {
              if (val.terminal_id !== '-' && ids.indexOf(Number(val.terminal_id)) === -1) {            
                ids.push(Number(val.terminal_id))
              }
            })
          } else {
            success.data.forEach((val, i) => {
              if (val.terminal_id !== '-' && ids.indexOf(Number(val.terminal_id)) === -1) {
                ids.push(Number(val.terminal_id))
              }
            })
          }
        success.data.forEach((val, i) => {
          this.setState({
            tIds: ids.sort(this.sortNumber)
          })
        })
        if (this.state.driverData.length > 0) {
          arr = this.state.driverData
          success.data.forEach((val, i) => {
            arr.push(val)
          })
          this.setState({
            driverData: arr,
          })
        } else {
          this.setState({
            driverData: success.data,
          })
        }
        this.setState({
          total: success.meta.pagination.total,
        })
      }
    }, (err) => {
      this.setState({
        isRequesting: false
      })
    });
  }

  handleScroll(event) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight
    ) {
      if (this.state.total === this.state.driverData.length) {
        return
      }
      setTimeout(() => {
        this.setState({
          page: this.state.page + 1
        })
        this.getDriversList()
      }, 200)
    }
  }

	/**
	 * When Component Did Mount
	 */
  componentDidMount() {
    this.getDriversReport();
    this.getDriversList();
  }

  /* Constructor */
  constructor(props) {
    super(props);
    this.user = getUserDataFromLocalStorage();
  }

	/**
	 * get Drivers Report
	 */
  getDriversReport() {
    if (!this.state.end_del_date || this.state.end_del_date === '') return
    this.setState({
      isRequesting: true
    })
    var url = '/fasttrac/drivers-settlement-report'
    var params = this.getFilterParams();
    httpGet(url, params).then((success) => {
      this.combineObjectByDriverID(success.data)
      this.setState({
        isRequesting: false
      })
    }, (err) => {
      this.setState({
        isRequesting: false
      })
    });
  }

  selectedDate(type, date) {
    var date_format = moment(date).format("YYYY-MM-DD");
    if(type === 'to') {
      this.setState({
        end_del_date: date_format,
        to: date
      },() => this.getDriversReport())
    }else {
      this.setState({
        from: date,
        start_del_date: date_format
      })
    }
  }

  /**
   * Apply Filter and seting params
   */
  getFilterParams() {
    let params = {}
    if (this.state.start_del_date) {
      params['start_del_date'] = this.state.start_del_date
    }
    
    if (this.state.end_del_date) {
      params['end_del_date'] = this.state.end_del_date
    }
    
    if (this.state.terminal && this.state.terminal !== 'all') {
      params['terminal'] = this.state.terminal
    }
    
    if (this.state.driver_id && this.state.driver_id !== 'all') {
      params['driver_id'] = this.state.driver_id
    }
    return params
  }

  select(event, list) {
    this.setState({
      terminal: list.terminal_id
    }, () => this.getDriversReport())
  }
  select2(event, list) {
    this.setState({
      driver_id: list.fasttrac_driver_num
    }, () => this.getDriversReport())
  }

  combineObjectByDriverID(data) {
    var previous
    var seen = {}
    var arr = []
    data.filter(entry => {    
      // Have we seen this label before?
      if (seen.hasOwnProperty(entry.driver_id)) {
        // Yes, grab it and add this data to it
        previous = seen[entry.driver_id];
        previous.data.push(entry);
    
        // Don't keep this entry, we've merged it into the previous one
        return false;
      }
    
      // entry.data probably isn't an array; make it one for consistency
      if (!Array.isArray(entry)) {
        entry.data = [entry];
      }
    
      // Remember that we've seen it
      seen[entry.driver_id] = entry;

      arr.push(seen[entry.driver_id])
    });
    this.setState({
      driverReportData: arr
    })
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  toggle2() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }
  
  render() {
    const { user } = this.user;
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    var totPay = 0;
    
    // var is_disabbled = !from || from!==undefined ? true : false
    return (
      <div className="container-scroller">
        {/* partial:partials/_navbar.html */}
        <Topbar user={user} />

        {/* partial */}
        <div className="container-fluid page-body-wrapper">
          {/* partial:partials/_sidebar.html */}
          <Sidebar user={user} />
          {this.state.isRequesting ?
            <Loader isLoader={this.state.isRequesting} /> :
            <div className="table-warper">
              <div className="top-filters">
                <div className="inline-block">
                  <DayPickerInput
                    value={from}
                    formatDate={formatDate}
                    parseDate={parseDate}
                    format="LL"
                    placeholder={`From`}
                    dayPickerProps={{
                      selectedDays: [from, { from, to }],
                      disabledDays: { after: to },
                      toMonth: to,
                      modifiers
                    }}
                    onDayChange={(e) => this.selectedDate('from', e)}
                  />
                </div>
                <div className="inline-block">
                  <DayPickerInput
                    value={to}
                    formatDate={formatDate}
                    parseDate={parseDate}
                    format="LL"
                    placeholder={`To`}
                    dayPickerProps={{
                      selectedDays: [from, { from, to }],
                      disabledDays: { before: from },
                      modifiers,
                      month: from,
                      fromMonth: from
                    }}
                    inputProps={{
                      disabled: !this.state.start_del_date || this.state.start_del_date === '' ? true : false
                    }}
                    onDayChange={(e) => this.selectedDate('to', e)}
                  />
                </div>
                {/* <DayPicker /> */}
                <div className="inline-block">
                  <Dropdown direction="down" isOpen={this.state.isOpen} toggle={() => this.toggle()} onScroll={e => this.handleScroll(e)}>
                    <DropdownToggle caret>
                      Select Terminal
                  </DropdownToggle>
                    <DropdownMenu>
                      {
                        this.state.driverData.length > 0 ?
                            this.state.tIds.map((list, i) => {
                            return (<DropdownItem onClick={(e) => this.select(e, list)} key={i}>{list}</DropdownItem>)
                          }) : <DropdownItem />

                      }
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className="inline-block">
                    <Dropdown direction="down" isOpen={this.state.dropdownOpen} toggle={() => this.toggle2()} onScroll={e => this.handleScroll(e)}>
                    <DropdownToggle caret>
                      Select Driver
                  </DropdownToggle>
                    <DropdownMenu>
                      {
                        this.state.driverData.length > 0 ?
                          this.state.driverData.map((list, i) => {
                            return (<DropdownItem onClick={(e) => this.select2(e, list)} key={i}>{list.reference_name}</DropdownItem>)
                          }) : <DropdownItem />
                      }
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <button className="btn btn-success btn-fw float-right" onClick={()=>this.printDiv()} disabled={this.state.driverReportData.length<=0}>Print</button>
              </div>
              <div id="DivIdToPrint">
                    { this.state.driverReportData.length > 0 ?
                      this.state.driverReportData.map((list, i) => {
                      return(
                          <Table striped className="report-table" key={i}>
                            <tbody>
                                <tr className="table-top-bottom">
                                  <td>Driver: {list.drivername}</td>
                                  <td colSpan='6'>#: {list.driver_id}</td>
                                </tr>
                              <tr>
                                <td>CNTRL#: {list.cntrl}</td>
                                <td colSpan='6'>{list.customer}</td>
                              </tr>
                              <tr>
                                <td>{list.shipper}</td>
                                <td>{list.consignee}</td>
                                <td colSpan='5'>DELIVERY DATE: {list.del_date}</td>
                              </tr>
                                <tr>
                                <td>{list.pu_city}, {list.pu_state}</td>
                                <td colSpan='6'>{list.de_city}, {list.de_state}</td>
                                </tr>
                              <tr className="table-head-row">
                                <th>Change Code</th>
                                <th>Billed to Cust</th>
                                <th>Line Haul</th>
                                <th>Line Haul Pay</th>
                                <th>Imputted Fuel</th>
                                <th>Imputted Insurance</th>
                                <th>Total Pay</th>
                              </tr>
                              {
                                list.data.map((d, j) => {
                                  totPay += parseFloat(d.total_pay === '-' ? 0 : d.total_pay)
                                  return (
                                    <tr key={j}>
                                      <td>{d.chg_code}</td>
                                      <td>{numeral(d.amount_billed).format('$0,0.00')}</td>
                                      <td>{numeral(d.line_haul).format('$0,0.00')}</td>
                                      <td>{numeral(d.line_haul_pay).format('$0,0.00')}</td>
                                      <td>{numeral(d.imputted_fuel).format('$0,0.00')}</td>
                                      <td>{numeral(d.imputted_insurance).format('$0,0.00')}</td>
                                      <td>{numeral(d.total_pay).format('$0,0.00')}</td>
                                    </tr>
                                  )
                                })
                              }
                              <tr className="table-top-bottom">
                                  <td colSpan="7" className="text-right">
                                  Total: {numeral(totPay).format('$0,0.00')}
                                  </td>
                                </tr>
                            </tbody>                      
                          </Table>                  
                      )
                      }) : null }
                  </div>
            </div>  }
         </div> 
      </div> 
      );
    }
  }
  
export default withSnackbar(withRouter(SettlementReports));