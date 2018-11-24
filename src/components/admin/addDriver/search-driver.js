/**
 * Import section
 */
import React, { Component } from 'react'
import List from './list-popup'
import data from '../../../data/drivers.json'

/**
 * Class defintion
 */
class SearchDriver extends Component {
  /**
   * State
   */
  state = {
    showList: false, 
    driverData: [], 
  }

  /**
   * Timeout
   */
  timeouts = {
    driverSearch: null
  } 

  /**
   * Get driver List
   */
  getDriversList(event) {
    var val = event.target.value
    if (this.timeouts.driverSearch) clearTimeout(this.timeouts.driverSearch)
    if (!val || val.length < 2 || val === '') {
      this.setState({
        showList: false
      })
      return
    }
    this.setState({
      driverData: data,
      showList: true
    })    
  }

  /**
   * get driver detail
   */
  getDriverDetail(driver) {
    this.setState({
      showList: false
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
      console.log("load more will go here");
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
          <div className="search-bar-wrap form-group">
            <label htmlFor="exampleInputName1">Search Driver</label>
            <input
              type="text"
              className="form-control"
              onChange={e => this.getDriversList(e)}
              autoComplete="off"
              placeholder="Search By Driver Name Or Driver Number"              
            />           
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
                                {driver.firstname}{' '}
                                {driver.lastname ? driver.lastname : ''}
                              </span>
                              <div className="row list-detailed-cont">
                                <div className="list-info-other col-sm-6">
                                  {driver.email ? (
                                    <span>
                                      <span className="info-label">email: </span>{' '}
                                      <span className="info-txt">
                                        {driver.email}
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
