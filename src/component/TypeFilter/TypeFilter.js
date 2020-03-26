import React from 'react';
import 'style/type-color.css';
import './type-filter.css';

export class TypeFilter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {types: []}
	}

	componentDidMount() {
		fetch('https://pokeapi.co/api/v2/type/')
			.then(res => res.json())
			.then(res => this.setState({types: res.results}))
	}

	render() {
		return (
			<React.Fragment>
				{this.state.types.map((val, idx) =>
					<div className='checkbox-container' key={'filter'+idx}>
						<label> 
							<input type="checkbox" onChange={this.props.onChange} value={val.url} />
							<span className={"checkmark " + val.name}>{val.name}</span>
						</label>
					</div>
				)}
			</React.Fragment>
			)
	}
}