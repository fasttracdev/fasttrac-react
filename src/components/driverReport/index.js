/**
 * import Section
 */
import React, { Component } from 'react';
import { Table } from 'reactstrap'
import { withSnackbar } from 'notistack';
import { withRouter } from "react-router";
import { httpGet } from '../../services/https';
import { getUserDataFromLocalStorage } from '../../services/helper';
import '../../components/admin/style.css';
import Topbar from '../../components/admin/topbar';
import Loader from '../../Loader/loader'
import Sidebar from '../../components/admin/sidebar';
import ENV from '../../environment/env'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';

var numeral = require('numeral');

/**
 * Class Declaration
 */
class DriversReports extends Component {
  _env = new ENV()
  user = {};
	/**
	 * state
	 */
  state = {
    driversReports: [],
    isRequesting: false,
    total_pages: 0,
    page: 1,
    limit: 30,
    order_dir: 'desc',
    order_field: 'id',
    report: {},
    open: false,
    is_filter: false,
    chg_code: '',
    customer: '',
    selectedDay: undefined,
    from: undefined,
    to: undefined,
  };	

	/**
	 * When Component Did Mount
	 */
  componentDidMount() {
    this.getDriversReport();
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
    var url = '/fasttrac/driver-settlement-report'
    var params = this.getFilterParams();
    httpGet(url, params).then((success) => {
      success.data.forEach(function (element, key) {
        element.key = key + 1;
        element.amount_billed = numeral(element.amount_billed).format('$0,0.00');
      });
      this.setState({
        driversReports: success.data,
        isRequesting: false
      });
    }, (err) => {
      this.handleErrorMessage(err);
    });
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
   
    return params
  }

	/**
	 * handle error message
	 */
  handleErrorMessage(err) {
    if (err.errors && err.errors.message) {
      this.props.enqueueSnackbar(err.errors.message, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
        autoHideDuration: 3000
      });
    }
    if (err.errors && !err.errors.message) {
      this.props.enqueueSnackbar(err.errors, {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        variant: 'error',
        autoHideDuration: 3000
      });
    }
    this.setState({
      isRequesting: false
    })
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


  selectedDate(type, date) {
    var date_format = moment(date).format("YYYY-MM-DD");
    if (type === 'to') {
      this.setState({
        end_del_date: date_format,
        to: date
      }, () => this.getDriversReport())
    } else {
      this.setState({
        from: date,
        start_del_date: date_format
      })
    }
  }

  render() {
    const { user } = this.user;
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    var totPay = 0;
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
                <button className="btn btn-success btn-fw float-right" onClick={() => this.printDiv()} disabled={this.state.driversReports.length <= 0}>Print</button>
              </div>
              <div id="DivIdToPrint">
                {this.state.driversReports.length > 0 ?
                      <Table striped className="report-table" >
                        <tbody>
                          <tr className="table-top-bottom">
                            <td>Driver: {this.state.driversReports[0].drivername}</td>
                            <td colSpan='6'>#: {this.state.driversReports[0].driver_id}</td>
                          </tr>
                          <tr>
                            <td>CNTRL#: {this.state.driversReports[0].cntrl}</td>
                            <td colSpan='6'>{this.state.driversReports[0].customer}</td>
                          </tr>
                          <tr>
                            <td>{this.state.driversReports[0].shipper}</td>
                            <td>{this.state.driversReports[0].consignee}</td>
                            <td colSpan='5'>DELIVERY DATE: {this.state.driversReports[0].del_date}</td>
                          </tr>
                          <tr>
                            <td>{this.state.driversReports[0].pu_city}, {this.state.driversReports[0].pu_state}</td>
                            <td colSpan='6'>{this.state.driversReports[0].de_city}, {this.state.driversReports[0].de_state}</td>
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
                            this.state.driversReports.map((d, j) => {
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
                    : null}
              </div>
            </div>}
        </div>
      </div> 
    );
  }
}

export default withSnackbar(withRouter(DriversReports));