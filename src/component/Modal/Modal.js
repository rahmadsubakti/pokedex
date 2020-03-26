import React from 'react';
import { createPortal } from 'react-dom';
import './modal.css'

const body = document.body;

export class ModalBase extends React.Component {
	constructor(props) {
		super(props);
		this.element = document.createElement('div');
		this.element.className = 'modal'
	}

	componentDidMount() {
		body.appendChild(this.element);
	}

	componentWillUnmount() {
		body.removeChild(this.element);
	}

	render() {
		return createPortal(this.props.children, this.element)
	}

}


export function Modal(props) {
	return (
		<ModalBase>
			<div className="modal-container">
            	<div className="modal-close-container">
            		{props.onClick &&
            			<button 
                		onClick={props.onClick}
                		className="close-btn"
                    	value="close">
                    		x
                  		</button>
            		}
                </div>
                <div className="modal-content">
                  {props.children}
                </div>
            </div>
        </ModalBase>
	)
}