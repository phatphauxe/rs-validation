import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      urlInput: '',
      jsonData: '',
      stringData: ''
    }
  }
  getByUrl = (e) => {
      let url = this.state.urlInput;
      fetch("/getData", {body: JSON.stringify({url:url}), method:'POST', headers: {"Content-Type":"application/json"}}).then(response => {
          return response.json()
      }).then(json => {
        this.orderJson(JSON.parse(json.response.body));
        this.setState({jsonData: json.response.body});
      });
  }

  orderJson = (data) => {
    let result = `"lookup"\t"value"\n`;
    if(data.price){
        data.price.forEach(p => {
            let code = p.code;
            p.priceLineItems.forEach(li => {
                let pt = li.priceType;
                result += `"${code}|${pt}|listPrice"\t`; 
                result += `"${Number(""+li.listPrice+"")}"\n`

                result += `"${code}|${pt}|cost"\t"${Number(""+li.cost+"")}"\n`
                if(li.discounts){
                  if(li.discounts[0] !== null){
                    li.discounts.forEach(dc => {
                        if(dc.discountType){
                            result += `"${code}|${pt}${dc.discountType}${dc.qualifier ? '|'+Number(""+dc.qualifier+""):''}|NA"\t"${isNaN(Number(""+dc.discountValue+"")) ? dc.discountValue: Number(""+dc.discountValue+"")}"\n`;
                        }
                    });
                  }
                }
            });
        });
    };
    if(data.fees){
        let keys = Object.keys(data.fees);
        keys.forEach(f => {
            if(isNaN(data.fees[f])){
                result += `"FEE|${f}"\t"${data.fees[f]}"\n`;
            }
            else {
                result += `"FEE|${f}"\t"${Number(""+data.fees[f]+"")}"\n`;
            }
        }); 
    }
    if(data.rates){
        data.rates.forEach(r => {
            result += `"SRR|${r.serviceCode}"\t"${Number(""+r.serviceCharge+"")}"\n`
        })
    }
    this.setState({stringData: result}, () => {
      let response = document.querySelector('#stringData');
      response.select();
      document.execCommand('copy');
    })
}
  
  changeUpdate = (e) => {
    this.setState({[e.target.id]: e.target.value});
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <div> <input id='urlInput' type='text' value={this.state.urlInput} onChange={this.changeUpdate}/> <button onClick={this.getByUrl} disabled={this.state.urlInput === ''}>Submit</button></div>
          <div style={{display:'flex', flexDirection: 'row', width:'1000px', margin: 'auto', height: '90vh'}}>
              <div style={{width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
                  <label>JSON SUBMITTION</label>
                  <textarea id='jsonData' style={{height:'85%'}} value={this.state.jsonData} onChange={this.changeUpdate}></textarea>
                  
              </div>
              <div style={{width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
                  <label>RESULTS</label>
                  <textarea id='stringData' style={{height: '85%'}} value={this.state.stringData} onChange={this.changeUpdate}></textarea>
              </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
