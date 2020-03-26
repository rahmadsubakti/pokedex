import React from 'react'

import { LoadAnimation } from 'component/LoadAnimation/LoadAnimation'

import 'style/type-color.css';
import './card.css'

export class Card extends React.Component {
    constructor(props) {
        super(props)
        this.state = { name: '', sprites: '', types: [], stat: [], loading: false, matchType: true }
        this.fetchPokemon = this.fetchPokemon.bind(this)
        this.checkTypes = this.checkTypes.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.fetchPokemon(this.props.url)
    }

    fetchPokemon(url) {
        fetch(url)
            .then(res => res.json())
            .then(res => this.setState({
                name: res.name,
                sprites: res.sprites.front_default,
                types: res.types,
                stat: res.stats,
                loading: false
            }))

    }

    checkTypes() {
        const set = new Set([...this.props.types, ...this.state.types])
        return set.size === this.state.types.length;
    }

    componentDidUpdate(prevProps) {
        if (this.props.url !== prevProps.url) {
            this.setState({ loading: true })
            this.fetchPokemon(this.props.url)
        }
        if (this.props.types !== prevProps.types) {
            this.setState({ matchType: this.checkTypes() })
        }
    }

    render() {
        if (this.state.matchType) {
            if (!this.state.loading) {
                return (
                    <div className="card" value={this.props.url} onClick={this.props.onClick}>
						<div className="img-container">
							<img src={this.state.sprites} alt={this.state.name} />
						</div>
						<div className="pokemon-info">
							<h2>{this.state.name}</h2>
							{this.state.types.map(val => 
                                <span 
                                    className={'type ' + val.type.name} 
                                    key={'type'+val.type.name}>
                                        {val.type.name}
                                </span>
							)}
						</div>
                        <button value={this.props.url} onClick={this.props.onClick}>View</button>
					</div>
                )
            }
            return (
                <div className="card">
					<LoadAnimation />
				</div>
            )
        }
    }
}