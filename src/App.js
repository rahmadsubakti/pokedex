import React from 'react';

import { Card } from 'component/Card/Card'
import { TypeFilter } from 'component/TypeFilter/TypeFilter'
import { Modal } from 'component/Modal/Modal'
import { PokeInfo } from 'component/PokeInfo/PokeInfo'
import { LoadAnimation } from 'component/LoadAnimation/LoadAnimation'
import './App.css';
import 'style/media.css';

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            pokemon: [], // data to show to page
            pokemonBasedType: [],
            next: null,
            current: '',
            showModal: false,
            limit: 20,
            filter: '',
            loading: true,
        }
        this.value = '';
        this.fetchAPI = this.fetchAPI.bind(this);
        this.fetchType = this.fetchType.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filterPokemonByType = this.filterPokemonByType.bind(this)
    }

    fetchAPI(url) {
        fetch(url)
            .then(res => res.json())
            .then(res => this.setState(prevState =>
                ({
                    data: [...prevState.data, ...res.results],
                    pokemon: [...prevState.data, ...res.results],
                    next: res.next,
                })
            ))
            .then(() => this.state.next === null ? this.setState({loading: false}) : null)
    }

    fetchType(url) {
        fetch(url)
            .then(res => res.json())
            .then(res => res.pokemon)
            .then(res => res.map(val => val.pokemon.name))
            .then(function(res) { return [{ url: url, list: res }] })
            .then(res => this.setState(prevState => ({ pokemonBasedType: [...prevState.pokemonBasedType, ...res] })))
            .then(res => this.filterPokemonByType())

    }

    filterPokemonByType() {
        if (this.state.pokemonBasedType.length !== 0) {
            const pokemonBasedType = this.state.pokemonBasedType[this.state.pokemonBasedType.length - 1].list;
            let pokemon = [...this.state.pokemon]
            pokemon = pokemon.filter(val => pokemonBasedType.includes(val.name))
            this.setState({ pokemon: pokemon, limit: 20 })
        }
    }


    componentDidMount() {
        this.fetchAPI('https://pokeapi.co/api/v2/pokemon/')
    }

    componentDidUpdate() {
        if (this.state.next !== null) {
            this.fetchAPI(this.state.next);
        }
        this.value = '';
    }

    handleClick(e) {
        e.preventDefault();
        switch (e.target.value) {
            case 'next':
                this.setState((prevState) => ({ limit: prevState.limit + 20 }));
                break;
            case 'prev':
                this.setState((prevState) => ({ limit: prevState.limit - 20 }));
                break;
            case 'clear':
                const checkboxes = document.querySelectorAll('input[type=checkbox]')
                checkboxes.forEach(el => el.checked = false)
                this.setState({ pokemon: this.state.data })
                break;
            case 'close':
                this.setState({current: '', showModal: false})
                break;
            default:
                this.setState({current: e.target.value, showModal: true})
                break;
        }
    }

    handleChange(e) {
        this.value = e.target.value;
        const pattern = new RegExp(e.target.value, 'i');
        let pokemon = [...this.state.data];
        pokemon = pokemon.filter(val => pattern.test(val.name))
        this.setState({ pokemon: pokemon, limit: 20 });
    }

    handleCheckboxChange(e) {
        if (e.target.checked) {
            this.fetchType(e.target.value)
        } else {
            let types = [...this.state.pokemonBasedType]
            this.setState({ pokemon: [...this.state.data], limit: 20 })
            types = types.filter(val => val.url !== e.target.value)
            this.setState({ pokemonBasedType: [...types] }, () => this.filterPokemonByType())
        }
    }

    render() {
        const limit = this.state.limit;

        const pokemonList = this.state.pokemon.slice(limit - 20, limit).map((val, idx) =>
            <Card url={val.url} types={this.state.types} onClick={this.handleClick} key={"card" + idx} />
        )

        return (
            <div>
              <header>
                <input 
                  type="text" 
                  placeholder="Search pokemon(s)" 
                  onChange={this.handleChange} 
                  value={this.value} 
                />
              </header>
              <div className="filter-btn-group">
                <button onClick={this.handleClick} value="clear">Clear</button>
                <TypeFilter onChange={this.handleCheckboxChange.bind(this)} />
              </div>
              {this.state.loading 
                ?
                  <Modal>
                    <LoadAnimation />
                  </Modal> 
                :
                  <main>
                    <div className="main-content">
                      {pokemonList}
                    </div>

                    <div className="btn-group">
                      <button 
                      onClick={this.handleClick} 
                      value="next" 
                      disabled={this.state.limit >= this.state.pokemon.length}>
                        Next
                      </button>

                      <button 
                        onClick={this.handleClick} 
                        value="prev" 
                        disabled={(this.state.limit-20) === 0}>
                          Previous
                      </button>
                    </div>
                  </main>
              }
              
            {this.state.showModal &&
            <Modal onClick={this.handleClick}>
              <PokeInfo url={this.state.current} />
            </Modal>}

          </div>
        )
    }
}

export default App;