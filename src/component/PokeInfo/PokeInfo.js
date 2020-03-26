import React from 'react';
import PropTypes from 'prop-types';

import { LoadAnimation } from 'component/LoadAnimation/LoadAnimation';

import 'style/type-color.css';
import './pokeinfo.css';


export class PokeInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pokemon: {},
            loading: true,

        }
        this.fetchPokemon = this.fetchPokemon.bind(this);
    }

    componentDidMount() {
        this.fetchPokemon(this.props.url)
    }

    fetchPokemon(url) {
        fetch(url)
            .then(res => res.json())
            .then(res => this.setState({
                pokemon: res,
                loading: false
            }))

    }

    render() {
    	const pokemon = this.state.pokemon;
    	if (!this.state.loading) {
        return (
        	<div className="pokemon">
        		<div class="img-container">
        			<img src={pokemon.sprites.front_default} alt={pokemon.sprites.front_default} />
        		</div>
        		<div className="pokemon-info">
        			<div>
        				<h2>{pokemon.name}</h2>
        			</div>
        			<div className="pokemon-types">
        				{pokemon.types.map(val => <span className={'type ' + val.type.name}>{val.type.name}</span>)}
        			</div>
                    <h4>Body data</h4>
        			<div className="pokemon-body">
        				<span>{pokemon.weight / 10 } cm</span>
        				<span>{pokemon.height * 10 } kg</span>
        			</div>
                    <h4>Moves</h4>
        			<div className="pokemon-moves">
        				{pokemon.moves.map(val => <span className="move">{val.move.name}</span>)}
        			</div>
                    <h4>Stats</h4>
        			<div className="pokemon-stats">
        				<table>
        					{pokemon.stats.map(val => <tr><td>{val.stat.name}</td><td>{val.base_stat}</td></tr>)}
        				</table>
        			</div>
        		</div>
        	</div>
        )
    }
    	return (
            <div className="pokemon">
                <LoadAnimation />
            </div>
        )
    }
}

PokeInfo.propTypes = {
    url: PropTypes.string.isRequired
}