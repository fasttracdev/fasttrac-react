/**
 * import Section
 */
import React, { Component } from 'react'
import { ClipLoader } from 'react-spinners'
/**
 * Class Declaration
 */
class Loader extends Component {
  /**
   * Render HTML
   */
  render() {
    return (
      <span className={this.props.isLoader ? 'page-loader ' : 'display-none'}>
        {this.props.isLoader && (
          <span className="page-loader-col">
            <span className="page-spinner-col">
              <ClipLoader color={'#b60000'} loading={this.props.isLoader} />
            </span>
          </span>
        )}
      </span>
    )
  }
}
/**
 * Export Section
 */
export default Loader
