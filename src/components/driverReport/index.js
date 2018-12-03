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

/**
 * Class Declaration
 */
class DriversReports extends Component {
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
    report: {},
    open: false,
  };

	/**
	 * Column
	 */
  columns = [
    // { title: 'Driver Name', dataIndex: 'drivername', key: 'drivername', width: 1000 },
    // { title: 'Driver Id', dataIndex: 'driver_id', key: 'driver_id', width: 1000 },
    { title: 'S No', dataIndex: 'key', key: 'key', width: 1000 },
    { title: 'Week', dataIndex: 'week', key: 'week', width: 1000 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 1000 },
    { title: 'Ref', dataIndex: 'ref', key: 'ref', width: 1000 },
    { title: 'Amount Billed', dataIndex: 'amount_billed', key: 'amount_billed', width: 1000 },
    { title: 'Consignee', dataIndex: 'consignee', key: 'consignee', width: 1000 },
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
    url += 'limit=' + this.state.limit
    url += '&page=' + this.state.page
    httpGet(url).then((success) => {
      success.data.forEach(function (element, key) {
        element.key = key + 1;       
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
	 * handle error message
	 */
  handleErrorMessage(err) {
    if (err.errors && err.errors.message) {
      this.props.enqueueSnackbar(err.errors.message, {
        variant: 'error',
        autoHideDuration: 3000
      });
    }
    if (err.errors && !err.errors.message) {
      this.props.enqueueSnackbar(err.errors, {
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
                <div className="row">
                  <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                      <div className="card-body">
                        <h2 className="card-title">Drivers Report Listing</h2>
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
                                pageRangeDisplayed={10}
                                breakLabel={"..."}
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
            <Modal open={open} onClose={this.onCloseModal} center>
              <div className="row">
                <div className="col-12 text-center mb-2"> Report </div>
                <div className="col-6">
                  <div>
                    <span> Driver Name: </span>
                    <span>{report.drivername ? report.drivername: '---'}</span>
                  </div>
                  <div>
                    <span> Week: </span>
                    <span>{report.week ? report.week : '---'}</span>
                  </div>
                  <div>
                    <span> Ref: </span>
                    <span>{report.ref ? report.ref : '---'}</span>
                  </div>
                  <div>
                    <span> Customer: </span>
                    <span>{report.customer ? report.customer : '---'}</span>
                  </div>
                  <div>
                    <span> Amount Billed: </span>
                    <span>{report.amount_billed ? report.amount_billed : '---'}</span>
                  </div>
                  <div>
                    <span> Shipper: </span>
                    <span>{report.shipper ? report.shipper : '---'}</span>
                  </div>
                </div>
                <div className="col-6">
                  <div>
                    <span> Driver Id: </span>
                    <span>{report.driver_id ? report.driver_id:'---' }</span>
                  </div>
                  <div>
                    <span> Consignee: </span>
                    <span>{report.consignee ? report.consignee : '---'}</span>
                  </div>
                  <div>
                    <span> Pu City: </span>
                    <span>{report.pu_city ? report.pu_city : '---'}</span>
                  </div>
                  <div>
                    <span> Pu State: </span>
                    <span>{report.pu_state ? report.pu_state : '---'}</span>
                  </div>
                  <div>
                    <span> De City: </span>
                    <span>{report.de_city ? report.de_city : '---'}</span>
                  </div>
                  <div>
                    <span> De State: </span>
                    <span>{report.de_state ? report.de_state : '---'}</span>
                  </div>
                </div>
              </div>
            </Modal>
        </div>
      </div>
    );
  }
}

export default withSnackbar(withRouter(DriversReports));