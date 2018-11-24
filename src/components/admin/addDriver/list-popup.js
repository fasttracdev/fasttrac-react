import React, { Component } from 'react'
export default class List extends Component {
  render() {
    return (
      <div className="popup">
        <div className="popup-wrap">
          <div className="popup_inner">
            <h1>{this.props.text}</h1>
          </div>
        </div>
      </div>
    )
  }
}