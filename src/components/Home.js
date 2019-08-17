import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import firebaseapp from '../firebase'

export class Home extends Component {
    auth = firebaseapp.auth();
    database = firebaseapp.database();

    state = {
        "loggedIn": false,
        "emailid": "",
        "password": "",
        "buddygroup": "",
        "copiedTakenLot2": 0,
        "copiesTakenLot1": 0,
        "copyTransactions": [],
        "defective": 0,
        "email": "",
        "name": "",
        "rollno": 0,
        "soldTillDateCash": 0,
        "soldTillDatePaytm": 0
    }

    constructor(){
        super()
        let loginStatus = localStorage.getItem("loginStatus")
        
        if(loginStatus === "true"){
            let email_id = localStorage.getItem("email_id");
            let pw = localStorage.getItem("password");

            this.auth.signInWithEmailAndPassword(email_id, pw)
                .then(() => {
                    let uid = this.auth.currentUser.uid;

                    this.database.ref(`/salesdata/${uid}`).on('value', (snapshot) => {
                        let sales_data = snapshot.val();
                        console.log(sales_data)
                        this.setState(sales_data);
                    });
                })
                .catch((error) => {
                    alert(error.message);
                });

            this.state = {
                loggedIn: true,
                emailid : email_id,
                password: pw
            }


            
        }
        else {
            this.state = {
                loggedIn: false
            }
        }

    }

    cancelSalesModal = () => {
        let m = document.getElementById("salesDataModal");
        m.setAttribute("class","modal")
    }
    
    activateSalesModal = () => {
        let m = document.getElementById("salesDataModal");
        m.setAttribute("class","modal is-active");
    }

    cancelStockModal = () => {
        let m = document.getElementById("stockDataModal");
        m.setAttribute("class", "modal");
    }

    activateStockModal = () => {
        let m = document.getElementById("stockDataModal");
        m.setAttribute("class", "modal is-active");
    }

    cancelExchangeModal = () => {
        let m = document.getElementById("exchangeDataModal");
        m.setAttribute("class", "modal")
    }

    activateExchangeModal = () => {
        let m = document.getElementById("exchangeDataModal");
        m.setAttribute("class", "modal is-active");
    }

    render() {
        if(this.state.loggedIn == null || (this.state.loggedIn === "false")){
            return <Redirect to='/' />
        }

        return (
            <div>
                <h1 style={titleStyle}>Sales Portal</h1>
                <h3 style={subtitleStyle}>Desire Foundation</h3>
                <br></br>
                <div className='columns'  style={{ paddingLeft: '1rem', paddingRight: '1rem', margin: '0rem', marginBottom: '2rem'}}>
                    <div className='column is-narrow'>
                        <div className='box' style={boxStyle}>
                            <p style= {{fontSize: '1.75rem', fontWeight: '300'}}>Hii, <b>{this.state.name}</b></p>
                            <p style= {{fontSize: '1.2rem', fontWeight: '300', marginTop: '0.5rem'}}>
                                <i className="fas fa-envelope-open-text" style={{color: '#0d47a1', marginRight: '0.2rem'}}></i> {this.state.emailid}
                            </p>
                            <p style= {{fontSize: '1.2rem', fontWeight: '300'}}>
                                <i className="fas fa-users" style={{color: '#0d47a1', marginRight: '0.2rem'}}></i> Buddy Group : {this.state.buddygroup}
                            </p>
                        </div>
                    </div>

                    <div className='column is-narrow'>
                        <div className='box' style={boxStyle}>
                            <h1 className='title' style={{color: '#d50000'}}>
                                <i className="fas fa-money-check-alt"></i> Total Sold
                            </h1>

                            <h1 className='title' style={{fontWeight: '300'}}>
                                ₹ {(this.state.soldTillDateCash + this.state.soldTillDatePaytm) * 35} /-
                            </h1>
                            
                        </div>
                    </div>
                </div>

                <div className='columns' style={{ paddingLeft: '1rem', paddingRight: '1rem', margin: '0rem' }}>

                    <div className='column'>
                        <div className='box'>
                            <h1 style={cardHeaderStyle}>
                                <i className="fas fa-chart-area" style={{ marginRight: '1rem' }}></i> Sales Data 
                            </h1>

                            <br></br>

                            <p style={salesDataStyle}>Total Sales Amount : ₹ {(this.state.soldTillDateCash + this.state.soldTillDatePaytm) * 35}</p>

                            <br></br>
                            
                            <p style={salesDataStyle}>
                                <i className="fas fa-money-bill-alt" style={{ marginRight: '0.3rem' }}></i> Cash : ₹ {this.state.soldTillDateCash * 35} ({this.state.soldTillDateCash})
                            </p>
                            <p style={salesDataStyle}>
                                <i className="fas fa-credit-card" style={{ marginRight: '0.35rem' }}></i> Paytm : ₹ {this.state.soldTillDatePaytm * 35} ({this.state.soldTillDatePaytm})
                            </p>
                            
                            <br></br>

                        </div>
                    </div>

                    <div className='column'>
                        <div className='box'>
                            <h1 style={cardHeaderStyle}>
                                <i className="fas fa-box" style={{marginRight: '1rem'}}></i> Stock
                            </h1>

                            <br></br>

                            <p style={notebookStatusStyle}>Copies taken in Lot 1 : <b>{this.state.copiesTakenLot1}</b>  </p>
                            <p style={notebookStatusStyle}>Copies taken in Lot 2 : <b>{this.state.copiedTakenLot2}</b>  </p>
                            <br></br>
                            <p style={notebookStatusStyle}>Exchanged : <b>0</b>  </p>
                            <p style={notebookStatusStyle}>Defective : <b>{this.state.defective}</b>  </p>
                            <br></br>
                            <p style={notebookStatusStyle}>Gross Total:  <b>80</b>  </p>
                            <p style={notebookStatusStyle}>Total Copies Sold :  <b>{this.state.soldTillDatePaytm + this.state.soldTillDateCash}</b>  </p>
                            <p style={notebookStatusStyle}>Total Copies in Hand : <b>52</b>  </p>
                        </div>
                    </div>

                    <div className='column'>
                        <div className='box'>
                            <h1 style={cardHeaderStyle}>
                                <i className="fas fa-book-open" style={{ marginRight: '1rem'}}></i> Exchanged
                            </h1>
                            <br></br>
                            <br></br>
                            <p style={notebookExchangedStyle}>Total Exchanged : <b>0</b>  </p>
                        </div>
                    </div>
                </div>
                <br></br>

                <div style={{ paddingLeft: '2rem', paddingRight: '2rem', margin: '0rem' }} className="columns">
                    <button className="button is-large is-danger" onClick={ this.activateSalesModal } style={{marginRight:'1rem', marginBottom: '1rem'}}>
                        Add Sales Data
                    </button>
                    
                    <button className="button is-large is-info" onClick={ this.activateStockModal } style={{marginRight:'1rem', marginBottom: '1rem'}}>
                        Edit Stock Data
                    </button>
                    
                    <button className="button is-large is-warning" onClick={ this.activateExchangeModal } style={{marginRight:'1rem', marginBottom: '1rem'}}>
                        Add Exchange
                    </button>
                </div>

                <br></br>
                

                <div id="salesDataModal" className="modal">
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Add Sales Data</p>
                            <button className="delete" onClick={this.cancelSalesModal} aria-label="close"></button>
                        </header>
                        <section className="modal-card-body">
                            <form>
                                <div className='field'>
                                    <label className='label'>Add Copies Sold</label>
                                    <input className='input' type='number' required placeholder='This will be added to the Total'></input>
                                    
                                    <label className='label' style={{marginTop: '1rem'}}>
                                        <i className="fas fa-money-bill-alt" style={{ marginRight: '0.3rem' }}></i> In Cash
                                    </label>
                                    <input className='input' type='number' required placeholder='This will be added to the Total'></input>
                                    
                                    <label className='label' style={{marginTop: '1rem'}}>
                                        <i className="fas fa-credit-card" style={{ marginRight: '0.3rem' }}></i> In Paytm
                                    </label>
                                    <input className='input' type='number' required placeholder='This will be added to the Total'></input>

                                </div>
                                <br></br>
                                <input type='submit' className="button is-info" value="Update"></input>
                            </form>
                        </section>
                        <footer className="modal-card-foot"></footer>
                    </div>
                </div>



                <div id="stockDataModal" className="modal">
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Edit Stock Data</p>
                            <button className="delete" onClick={this.cancelStockModal} aria-label="close"></button>
                        </header>
                        <section className="modal-card-body">
                            <form>
                                <div className='field'>
                                    <label className='label'>Copies Taken in Lot 2</label>
                                    <input className='input' type='number' required placeholder='This will be added to the Total'></input>
                                    
                                    <label className='label' style={{marginTop: '1rem'}}>
                                        <i className="fas fa-window-close" style={{ marginRight: '0.3rem' }}></i> Defective
                                    </label>
                                    <input className='input' type='number' required placeholder='This will be added to the Total'></input>

                                </div>
                                <br></br>
                                <input type='submit' className="button is-info" value="Update"></input>
                            </form>
                        </section>
                        <footer className="modal-card-foot"></footer>
                    </div>
                </div>




                <div id="exchangeDataModal" className="modal">
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Add Exchange Data</p>
                            <button className="delete" onClick={this.cancelExchangeModal} aria-label="close"></button>
                        </header>
                        <section className="modal-card-body">
                            <form>
                                <div className='field'>
                                    <label className='label'>Exchanged With</label>
                                    <input className='input' type='text' required placeholder='Name of the person'></input>
                                    
                                    <label className='label' style={{marginTop: '1rem'}}>Number of Copies, + if taken, -ve if given</label>
                                    <input className='input' type='number' required placeholder='This will be added to the Total'></input>

                                </div>
                                <br></br>
                                <input type='submit' className="button is-info" value="Update"></input>
                            </form>
                        </section>
                        <footer className="modal-card-foot"></footer>
                    </div>
                </div>
            </div>
        )
    }
}

const titleStyle = {
    fontSize: '3.5rem',
    fontFamily: 'Rubik, sans-serif',
    marginLeft: '2rem',
    marginTop: '2rem',
    fontWeight: '500'
}

const subtitleStyle = {
    fontSize: '1.5rem',
    fontFamily: 'Heebo, sans-serif',
    marginLeft: '2rem',
    fontWeight: '300'
}

const boxStyle = {
    fontFamily: 'Heebo, sans-serif',
    backgroundColour: '#e0f2f1'
}

const cardHeaderStyle = {
    fontFamily: 'Rubik, sans-serif',
    fontSize: '2rem',
    fontWeight: '400'
}

const salesDataStyle = {
    fontFamily: 'Heebo, sans-serif',
    fontSize: '1.5rem',
    fontWeight: '300'
}

const notebookStatusStyle = {
    fontFamily: 'Heebo, sans-serif',
    fontSize: '1.3rem',
    fontWeight: '300'
}

const notebookExchangedStyle = {
    fontFamily: 'Heebo, sans-serif',
    fontSize: '1.6rem',
    fontWeight: '300'
}

export default Home