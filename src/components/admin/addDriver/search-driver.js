/**
 * Import section
 */
import React, { Component } from 'react'
import List from './list-popup'
import PhoneNumberFormat from '../../../pipes/phone-formate'
import { httpGet } from '../../../services/https';
import { ClipLoader } from 'react-spinners'
/**
 * Class defintion
 */
class SearchDriver extends Component {
  /**
   * Instance
   */
  _phoneFormat = new PhoneNumberFormat()
  
  /**
   * State
   */
  state = {
    showList: false, 
    driverData: [], 
    page: 1,
    limit: 10,
    searchName: '',
    isRequesting: false,
    noDriverFound: ''
  }

  /**
   * Timeout
   */
  timeouts = {
    driverSearch: null
  } 

  /**
   * Get Driver
   */
  getDriver(event) {
    try {
      var val = event.target.value
      this.setState({
        searchName: val
      })
      if (this.timeouts.driverSearch) clearTimeout(this.timeouts.driverSearch)
      if (!val || val.length === 0 || val === '') {
        this.setState({
          name: '',
          noDriverFound: ''
        })
        if (this.state.showList) {
          this.setState({
            showList: false
          })
        }
        return
      }
      this.timeouts.driverSearch = setTimeout(() => {
        this.setState({
          name: val,
          page: 1,
          driverData: []
        })
        this.setState({
          isRequesting: true,
        }) 
        this.getDriversList(val)
        if (this.state.showList) {
          this.setState({
            showList: false
          })
        }
      }, 1500) // 1000 = 1 second
    } catch (e) { }
  }


  /**
   * Get Drivers List
   */
  getDriversList(val) {
    if (this.timeouts.driverSearch) clearTimeout(this.timeouts.driverSearch)  
    let url = '/fasttrac/drivers?search=' + val
    url += '&page=' + this.state.page
    url += '&limit=' + this.state.limit
    httpGet(url).then((success) => {
      var arr = []
      if (success.data.length <= 0) {
        this.setState({
          showList: false,
          isRequesting: false,
          noDriverFound: 'No record found!'
        })
        return
      } else {
        if (this.state.driverData.length > 0) {
          arr = this.state.driverData
          success.data.forEach((val, i) => {
            arr.push(val)
          })
          this.setState({
            driverData: arr,
            isRequesting: false,
          })
        } else {
          this.setState({
            driverData: success.data,
            isRequesting: false
          })
        }
          this.setState({
            showList: true,
            total: success.meta.pagination.total,
            noDriverFound: ''
          })
        }
      }, (err) => {
        this.setState({
          isRequesting: false
        })
      });
  }


  /**
   * get driver detail
   */
  getDriverDetail(driver) {
    this.setState({
      showList: false,
      searchName: driver.reference_name
    })  
    this.props.setData(driver)
  }

  /**
   * Handle scroll
   * @param {*} event
   */
  handleScroll(event) {
    if (
      event.target.offsetHeight + event.target.scrollTop ===
      event.target.scrollHeight
    ) {
      if (this.state.total === this.state.driverData.length) {
        return
      }
      setTimeout(() => {
        this.setState({
          page: this.state.page + 1
        })
        this.getDriversList(this.state.name)
      }, 200)
    }
  }
  
  /**
   * Render HTML
   */
  render() {
    let that = this
    return (
      <div className="driver-searching-wrap driver-name-box">
        <div className="search-driver-wrap">
          <div className="search-bar-wrap form-group custom-loader-wrap">
            <label htmlFor="exampleInputName1">Search Driver</label>
            <input
              type="text"
              className="form-control"
              onChange={e => this.getDriver(e)}
              autoComplete="off"
              placeholder="Search By Driver Name Or Driver Number"   
              value ={this.state.searchName}
            />   
            <div className="sweet-loading">
              <ClipLoader color={'#b60000'} loading={this.state.isRequesting} />
            </div>   
            <div className="driver-not-found">
              <span>{this.state.noDriverFound}</span>
            </div>    
          </div>
            {
              !this.state.showList?null:
              <List
                text={
                  <ul
                    className="search-result-list"
                    onScroll={e => this.handleScroll(e)}
                  >
                    {this.state.driverData.map(function (driver, index) {
                      return (
                        <li
                          onClick={() => that.getDriverDetail(driver)}
                          key={'mykey' + index}
                        >      
                          <div className="list-info-driver">
                            <div className="list-info-inner">
                                <span className="driver-title">
                                {driver.reference_name}
                                  </span>
                                  <div className="row list-detailed-cont">
                                    <div className="list-info-other col-sm-6">
                                      {driver.address_1 ? (
                                        <span>
                                          <span className="info-label">
                                            Address:{' '}
                                          </span>{' '}
                                          <span className="info-txt">
                                            {driver.address_1}
                                          </span>
                                        </span>
                                      ) : null}
                                      {driver.city ? (
                                        <span>
                                          <span className="info-label">City: </span>{' '}
                                          <span className="info-txt">
                                            {driver.city}
                                          </span>
                                        </span>
                                      ) : null}
                                     
                                    </div>
                                    <div className="list-info-other col-sm-6">
                                      {driver.postal_code ? (
                                        <span>
                                          <span className="info-label">Zip: </span>{' '}
                                          <span className="info-txt">
                                            {driver.postal_code}
                                          </span>
                                        </span>
                                      ) : null}
                                      
                                      {driver.email ? (
                                        <span>
                                          <span className="info-label">Email:</span>{' '}
                                          <span className="info-txt">
                                            {driver.email}
                                          </span>
                                        </span>
                                      ) : null}
                                      {driver.phone ? (
                                        <span>
                                          <span className="info-label">Phone:</span>{' '}
                                          <span className="info-txt">
                                            {that._phoneFormat.transform(
                                              driver.phone,
                                              'US'
                                            )}
                                          </span>
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                        </div>
                        </li>
                      )
                    })}
                  </ul>
                }
              />
            }
        </div>       
      </div>
    )
  }
}
/**
 * Export Section
 */
export default SearchDriver
