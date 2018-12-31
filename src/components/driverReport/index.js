/**
 * import Section
 */
import React, { Component } from 'react';
import Table from 'rc-table';
import { withSnackbar } from 'notistack';
import { withRouter } from "react-router";
import { httpGet } from '../../services/https';
import { getUserDataFromLocalStorage } from '../../services/helper';
import '../../components/admin/style.css';
import Topbar from '../../components/admin/topbar';
import Loader from '../../Loader/loader'
import ReactPaginate from 'react-paginate'
import Modal from 'react-responsive-modal';
import Sidebar from '../../components/admin/sidebar';
import ENV from '../../environment/env'

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
    customer: ''
  };

	/**
	 * Column
	 */
  columns = [
    // { title: 'Driver Name', dataIndex: 'drivername', key: 'drivername', width: 1000 },
    // { title: 'Driver Id', dataIndex: 'driver_id', key: 'driver_id', width: 1000 },
    // { title: 'S No', dataIndex: 'key', key: 'key', width: 1000 },
    {
      title: <div onClick={() => { this.sortList('week') }}>
        <span>Week </span> <i className="mdi mdi-sort header-icon"></i>
      </div>, dataIndex: 'week', key: 'week', width: 1000 },
    {
      title: <div onClick={() => { this.sortList('customer') }}>
        <span>Customer </span> <i className="mdi mdi-sort header-icon"></i>
      </div>, dataIndex: 'customer', key: 'customer', width: 1000 },
    {
      title: <div onClick={() => { this.sortList('chg_code') }}>
        <span>Change Code </span> <i className="mdi mdi-sort header-icon"></i>
      </div>, dataIndex: 'chg_code', key: 'chg_code', width: 1000 },
    { title: 'Amount Billed', dataIndex: 'amount_billed', key: 'amount_billed', width: 1000 },
    {
      title: <div onClick={() => { this.sortList('consignee') }}>
        <span>Consignee </span> <i className="mdi mdi-sort header-icon"></i>
      </div>, dataIndex: 'consignee', key: 'consignee', width: 1000 },
    // { title: 'Shipper', dataIndex: 'shipper', key: 'shipper', width: 1000 },
    // { title: 'Pu City', dataIndex: 'pu_city', key: 'pu_city', width: 1000 },
    // { title: 'Pu State', dataIndex: 'pu_state', key: 'pu_state', width: 1000 },
    // { title: 'De City', dataIndex: 'de_city', key: 'de_city', width: 1000 },
    // { title: 'De State', dataIndex: 'de_state', key: 'de_state', width: 1000 },
    {
      title: 'Actions', dataIndex: 'id', key: 'operations',
      render: (val) => <div><button type="button" title="Edit" onClick={() => { this.viewReport(val) }} className="btn margin-right10 btn-icons btn-rounded btn-inverse-outline-primary"><i className="mdi mdi-eye"></i></button></div>
    }
  ];

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
    var url = '/fasttrac/driver-report?'
    var params = this.getFilterParams();
    httpGet(url, params).then((success) => {
      success.data.forEach(function (element, key) {
        element.key = key + 1;
        element.amount_billed = numeral(element.amount_billed).format('$0,0.00');
      });
      this.setState({
        driversReports: success.data,
        total_pages: success.meta.pagination.total_pages,
        isRequesting: false
      });
    }, (err) => {
      this.handleErrorMessage(err);
    });
  }

  /**
 * Toggle agent filter
 */
  toggleFilter() {
    this.setState({
      is_filter: !this.state.is_filter,
    })
  }

  /**
   * Apply Filter and seting params
   */
  getFilterParams(key) {
    let params = {}

    params['order_dir'] = this.state.order_dir
    params['order_field'] = this.state.order_field

    if (this.state.page) {
      params['page'] = this.state.page
    }

    if (this.state.limit) {
      params['limit'] = this.state.limit
    }

    if (this.state.ch) {
      params['chg_code'] = this.state.chg_code
    }
    if (this.state.customer) {
      params['customer'] = this.state.customer
    }

    return params
  }

  /**
 * make Query string
 */
  encodeQueryData(data) {
    const ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    return ret.join('&');
  }

	/**
   * Export Report
   */
  exportReport() {
    const querystring = this.encodeQueryData(this.getFilterParams());
    var url = this._env.getENV().API_BASE_URL + '/fasttrac/download-driver-report?'
    url += 'token=Bearer ' + getUserDataFromLocalStorage().token
    url += '&' + querystring
    window.open(url);
  }

  viewReport(id) {
    var ele = {}
    this.state.driversReports.forEach(function (element, key) {
      if(element.id === id) {
        ele = element;
      }
    });

    this.setState({ open: true, report: ele });
  }

  onCloseModal = () => {
    this.setState({ open: false });
  };

  /**
  * sortList
  */
  sortList(val) {
    this.setState({
      order_dir: this.state.order_dir === 'desc' ? 'asc' : 'desc',
      order_field: val,
    }, () => this.getDriversReport())
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

	/**
   * handle pagination
   * @param  p
   */
  handlePagination(p) {
    var page = p.selected + 1
    if (page === this.state.page) return
    this.setState({ page: page }, () => {
      this.getDriversReport()
    })
  }

  reset() {
    this.setState({
      chg_code: '',
      customer: '',
    }, () => this.getDriversReport())
  }

  render() {
    const { user } = this.user;
    const { open, report } = this.state;

    return (
      <div className="container-scroller">
        <div>

        </div>
        {/* partial:partials/_navbar.html */}
        <Topbar user={user} />

        {/* partial */}
        <div className="container-fluid page-body-wrapper">
          <Sidebar user={user} />
          {this.state.isRequesting ?
            <Loader isLoader={this.state.isRequesting} /> :
            <div className="main-panel">
              <div className="content-wrapper">

                <div className="grid-margin stretch-card">
                  <div className="advanced-filters-wrap">
                    <div className="table-btns">
                      <button
                        onClick={() => this.toggleFilter()}
                        className="btn btn-primary"
                      >
                        Advanced Filter <i className="mdi mdi-arrow-down" />
                      </button>
                    </div>
                  </div>
                </div>
                {
                  this.state.is_filter ?
                    <div className="filter-inner-content">
                      <div className="grid-margin stretch-card form-group">
                        <label htmlFor="exampleInputID">Change Code</label>
                        <input
                          className="form-control"
                          id="chg_code"
                          name="chg_code"
                          placeholder="Change Code"
                          type="text"
                          onChange={(e) => this.setState({
                            chg_code: e.target.value
                          })}
                          value={this.state.chg_code}
                          autoComplete="Off"
                        />
                      </div>
                      <div className="grid-margin stretch-card form-group">
                        <label htmlFor="exampleInputID">Customer</label>
                        <input
                          className="form-control"
                          id="customer"
                          name="customer"
                          placeholder="Customer"
                          type="text"
                          onChange={(e) => this.setState({
                            customer: e.target.value
                          })}
                          value={this.state.customer}
                          autoComplete="Off"
                        />
                      </div>
                      <button type="button" onClick={() => this.reset()} className="btn btn-primary apply-btn">Reset</button>   
                      <button type="button" onClick={() => this.getDriversReport()} className="btn btn-success apply-btn">Apply</button>
                    </div> : null
                }

                <div className="row">
                  <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h2 className="card-title">
                          <span>Driver Report Listing</span>
                          {/* <button type="button" onClick={() => this.exportReport()} className="btn btn-success mr-2 export-btn">Export</button> */}
                        </h2>
                        <button type="button" onClick={() => this.exportReport()} className="btn btn-success btn-fw add-driver-btn" disabled={this.state.driversReports.length <= 0}>Export</button>
                        <div className="table-responsive">
                          {
                            this.state.driversReports.length > 0 ?
                              <Table columns={this.columns} className="table table-bordered" data={this.state.driversReports} /> :
                              "No Record Found!"
                          }
                        </div>
                        {
                          this.state.driversReports.length > 0 ?
                            <div className="pagination-wrapper mt-3 mb-3 ml-3">
                              <ReactPaginate previousLabel={"<"}
                                nextLabel={">"}
                                breakClassName={"break-me"}
                                pageCount={this.state.total_pages}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={1}
                                breakLabel={". . ."}
                                onPageChange={e => this.handlePagination(e)}
                                containerClassName={"pagination"}
                                activeClassName={'active'}
                                subContainerClassName={"pages pagination"}
                                initialPage={this.state.page - 1}
                              />
                            </div> : null
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* footer */}
              <footer className="footer">
                <div className="container-fluid clearfix">
                  <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © 2018
      						{/* <a href="http://www.bootstrapdash.com/" target="_blank">Bootstrapdash</a>. All rights reserved. */}
                  </span>
                </div>
              </footer>
            </div>}
          <Modal open={open} onClose={this.onCloseModal}>
            <div className="report-modal-wrap">
              <h3 className="pb-0">Report</h3>
              <div className="p-3 pb-4">
                <table className="table report-table">
                  <tr>
                    <td>Driver Name</td>
                    <td>{report.drivername ? report.drivername : '---'}</td>
                  </tr>
                  <tr>
                    <td>Week</td>
                    <td>{report.week ? report.week : '---'}</td>
                  </tr>
                  <tr>
                    <td>Change Code</td>
                    <td>{report.chg_code ? report.chg_code : '---'}</td>
                  </tr>
                  <tr>
                    <td>Customer</td>
                    <td>{report.customer ? report.customer : '---'}</td>
                  </tr>
                  <tr>
                    <td>Amount Billed</td>
                    <td>{report.amount_billed ? report.amount_billed : '---'}</td>
                  </tr>
                  <tr>
                    <td>Shipper</td>
                    <td>{report.shipper ? report.shipper : '---'}</td>
                  </tr>
                  <tr>
                    <td>Driver Id</td>
                    <td>{report.driver_id ? report.driver_id : '---'}</td>
                  </tr>
                  <tr>
                    <td>Consignee</td>
                    <td>{report.consignee ? report.consignee : '---'}</td>
                  </tr>
                  <tr>
                    <td>Pu City</td>
                    <td>{report.pu_city ? report.pu_city : '---'}</td>
                  </tr>
                  <tr>
                    <td>Pu State</td>
                    <td>{report.pu_state ? report.pu_state : '---'}</td>
                  </tr>
                  <tr>
                    <td>De City</td>
                    <td>{report.de_city ? report.de_city : '---'}</td>
                  </tr>
                  <tr>
                    <td>De State</td>
                    <td>{report.de_state ? report.de_state : '---'}</td>
                  </tr>
                </table>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default withSnackbar(withRouter(DriversReports));