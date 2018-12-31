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
    driverData: []
  };


  /**
   * Get Drivers List
   */
  getDriversList() {
    let url = '/fasttrac/drivers'
    url += '?page=1'  
    url += '&limit=100'  
    httpGet(url).then((success) => {
      this.setState({
        driverData: success.data
      })
    });
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
    this.setState({
      isRequesting: true
    })
    var url = '/fasttrac/drivers-report?'
    url += '?page=1'
    url += '&limit=200' 
    httpGet(url).then((success) => {
      this.combineObjectByDriverID(success.data)
    }, (err) => {
    });
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
    var totPay = 0;
    return (
      <div className="container-scroller">
        {/* partial:partials/_navbar.html */}
        <Topbar user={user} />

        {/* partial */}
        <div className="container-fluid page-body-wrapper">
          {/* partial:partials/_sidebar.html */}
          <Sidebar user={user} />
          <div>

        </div>
        <div className="table-warper">
        <div className="top-filters">
            <div className="inline-block">
            <DayPickerInput
              formatDate={formatDate}
              parseDate={parseDate}
              format="LL"
              placeholder={`From`}
            />
          </div>
            <div className="inline-block">
          <DayPickerInput
            formatDate={formatDate}
            parseDate={parseDate}
            format="LL"
            placeholder={`To`}
          />
          </div>
          {/* <DayPicker /> */}
            <div className="inline-block">
              <Dropdown direction="down" isOpen={this.state.isOpen} toggle={() => this.toggle()}>
                <DropdownToggle caret>
                  Select Terminal
              </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={this.select}>All</DropdownItem>
                  <DropdownItem onClick={this.select}>1</DropdownItem>
                  <DropdownItem onClick={this.select}>2</DropdownItem>
                  <DropdownItem onClick={this.select}>3</DropdownItem>
                  <DropdownItem onClick={this.select}>4</DropdownItem>
                  <DropdownItem onClick={this.select}>5</DropdownItem>
                  <DropdownItem onClick={this.select}>6</DropdownItem>
                  <DropdownItem onClick={this.select}>7</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className="inline-block">
              <Dropdown direction="down" isOpen={this.state.dropdownOpen} toggle={() => this.toggle2()}>
                <DropdownToggle caret>
                  Select Driver
              </DropdownToggle>
                <DropdownMenu>
                  {
                    this.state.driverData.length > 0 ?
                      this.state.driverData.map((list, i) => {
                        return (<DropdownItem onClick={this.select} key={i}>{list.reference_name}</DropdownItem>)
                      }) : <DropdownItem />

                  }
                </DropdownMenu>
              </Dropdown>
            </div>
            <button className="btn btn-success btn-fw float-right">Print</button>
          </div>
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
                               totPay += parseFloat(d.total_pay == '-' ? 0 : d.total_pay)
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
         </div>
      </div>
    );
  }
}

export default withSnackbar(withRouter(SettlementReports));