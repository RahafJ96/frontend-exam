import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Card,Button } from 'react-bootstrap';
import { withAuth0 } from '@auth0/auth0-react';
class Home extends React.Component {
  constructor(props){
    super(props);
    this.state={
      allFlowers:[],
    }
  }

  componentDidMount(){
    axios.get('http://localhost:3001/getData').then(result=>{
      this.setState({
        allFlowers:result.data,
      })
      console.log(this.state.allFlowers);
    })
  }

  addToFavorite=(flowersObj)=>{
    console.log('clicked');
    const {user}=this.props.auth0;
    const newFlowers={
      name:flowersObj.name,
      instructions:flowersObj.instructions,
      photo:flowersObj.photo,
    }
    const params={
      userEmail:user.email,
      flowersObj:newFlowers,
    }
    axios.post('http://localhost:3001/addData',params)
  }


  render() {
    return (
      <>
        <h1>API Flowers</h1>
        {this.state.allFlowers.length && this.state.allFlowers.map((flower,idx)=>{
          return(
            <Card style={{width:'20rem',display:'inline-block'}}>
              <Card.Title>{flower.name}</Card.Title>
              <img src={flower.photo} style={{width:'20rem'}}/>
              <Card.Body>{flower.instructions}</Card.Body>
              <Button onClick={()=>{this.addToFavorite(flower)}}>Add to Favorite</Button>
            </Card>
          )
        })}
      </>
    )
  }
}

export default withAuth0(Home);
