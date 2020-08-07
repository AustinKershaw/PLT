import React, { Component } from "react";
import Loader from './common/Loader';
import Product from './models/Product';
import './App.css';


export default class App extends Component {
	constructor( props ){
		super( props );

		this.state = {
			products	: [],
			loading 	: true,
			error 		: false,
			filterOpen	: false,
			filters		: [],
			filter		: null,
			basket		: []
		};
	}

	// onload fetch product data
	componentWillMount(){
		new Product().get().then( products => {
			this.setState({
				products,
				loading : false,
				filters : new Set( products.map( product => product.colour ) ).toJSON()
			});
		})
		.catch( error => {
			this.setState({ error, loading : false });
		});
	}

	// toggle visibility of filter items
	toggleFilter( evt ){
		evt.preventDefault();
		this.setState({ filterOpen : !this.state.filterOpen });
	}

	// filter products
	filterClick( evt, filter ){
		evt.preventDefault();
		this.setState({ filter : filter === this.state.filter ? null : filter });
	}

	// displays filter items
	items(){
		if( !this.state.filterOpen ){ return };
		return (
			<div>
				<span className="filter-count">({ this.state.filters.length } filters)</span>
				<ul>
					{ this.state.filters.map( filter => (
						<li><a href="#" onClick={ evt => this.filterClick( evt, filter ) } {...( this.state.filter === filter ? { className : "selected" } : {} )} >{ filter }</a></li>
					)) }
				</ul>
			</div>
		);
	}

	// displays filter
	filter(){
		return (
			<div className="filter-wrap">
				<a href="#" onClick={ evt => this.toggleFilter( evt ) } >Colour Filter</a>
				{ this.items() }
			</div>
		);
	}

	// displays all products
	products(){
		return (
			<ul>
				{ this.state.products.filter( product => !this.state.filter || product.colour === this.state.filter ).map( product => {

					// check item already exists in basket array
					const inBasket = this.state.basket.find( item => item.id === product.id );

					return (
						<li>
							<div className="img-wrap">
								<img src={ product.img } alt={ product.name } />
							</div>
							<div className="info-wrap">
								<h2>{ product.name }</h2>
								<span>£{ product.price }</span>
							</div>
							<div className="actions-wrap">
								<ul>
									<li>
										<a href="#" onClick={ evt => this.removeQty( evt, product.id ) }>-</a>
									</li>
									<li>{ inBasket ? inBasket.quantity : 0 }</li>
									<li>
										<a href="#" onClick={ evt => this.addQty( evt, product.id ) }>+</a>
									</li>
								</ul>
								<a href="#" onClick={ evt => this.remove( evt, product.id ) }>Remove</a>
							</div>
						</li>
					)
				}) }
			</ul>
		);
	}

	// remove quantity of basket item
	removeQty( evt, id ){
		evt.preventDefault();

		// check item already exists in basket array
		const inBasket = this.state.basket.find( item => item.id === id );

		// if item not in basket or it does and quantity already zero, stop execution of function
		if( !inBasket || (inBasket && inBasket.quantity === 0) ){ return };

		// if item found in basket decrease quantity
		if( inBasket ){

			const obj = {
				id,
				price : inBasket.price,
				quantity : inBasket.quantity - 1
			};

			const items = this.state.basket.filter( item => item.id !== id );
			return this.setState({ basket : [ ...items, obj ] });

		};
	}

	// add quantity to basket item
	addQty( evt, id ){
		evt.preventDefault();

		// check item already exists in basket array
		const inBasket = this.state.basket.find( item => item.id === id );

		// if item exists in basket just update quantity
		if( inBasket ){

			const obj = {
				id,
				price : inBasket.price,
				quantity : inBasket.quantity + 1
			};

			const items = this.state.basket.filter( item => item.id !== id );
			return this.setState({ basket : [ ...items, obj ] });

		};

		// item wasnt found in basket so add it
		this.setState({
			basket : [
				...this.state.basket,
				{ 
					id,
					quantity : 1,
					price : this.state.products.find( item => item.id === id ).price
				}
			]
		});

	}

	// remove item from basket by id
	remove( evt, id ){
		evt.preventDefault();

		// check item already exists in basket array
		const inBasket = this.state.basket.find( item => item.id === id );

		// if item isnt found then stop executing function
		if( !inBasket ){ return };

		// filter out all basket items that have a matching id
		this.setState({ basket : this.state.basket.filter( item => item.id !== id ) });
	}

	// calculate basket total
	total(){
		let reducer = ( accumulator, currentVal ) => accumulator + ( currentVal.quantity * currentVal.price );
		const total = this.state.basket.reduce( reducer, 0 );
		return <h3 className="total">£{ total.toFixed(2) }</h3>;
	}

	render() {
		// if we have no product data show loader
		if( !this.state.products.length ){ return <div className="page-center"><Loader /></div> };
		return (
			<div className="home-page">
				{ this.filter() }
				{ this.products() }
				{ this.total() }
			</div>
		);
	}
};
