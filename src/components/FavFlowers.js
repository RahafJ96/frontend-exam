import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';
import { Card,Button,Modal } from 'react-bootstrap';

class FavFlowers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favFlowersArr: [],
      showModel: false,
      index: -1,
      flowersObj:{},
      flowerName:'',
      flowerPhoto:'',
      flowerinstructions:'',
    }
  }

  componentDidMount() {
    const { user } = this.props.auth0;
    axios.get('http://localhost:3001/getFavData', { params: { userEmail: user.email } }).then(result => {
      this.setState({
        favFlowersArr: result.data,
      })
    })
    

    console.log(this.state.favFlowersArr);
  }

  deleteFlower=(idx)=>{
    const {user}=this.props.auth0;
    axios.delete(`http://localhost:3001/deleteData/${idx}`,{ params: { userEmail: user.email } }).then(result=>{
      this.setState({
        favFlowersArr:result.data,
      })
    }).catch(error => { console.log(error) });
  }

  updateFlower=(flower,idx)=>{
    this.setState({
      flowersObj:flower,
      index:idx,
      flowerName:flower.name,
      flowerPhoto:flower.photo,
      flowerinstructions:flower.instructions,
      showModel:true,
    })
  }

  closeModel=()=>{
    this.setState({
      showModel:false,
    })
  }

  submitUpdate=(e)=>{
    e.preventDefault();
    this.closeModel();
    let newflowerName=e.target.name.value;
    let newflowerPhoto=e.target.photo.value;
    let newflowerinstructions=e.target.instructions.value;
    const newFlowerData={
      flowerName:newflowerName,
      flowerPhoto:newflowerPhoto,
      flowerinstructions:newflowerinstructions,
    }

    const {user}=this.props.auth0;

    const params={
      userEmail:user.email,
      flowersObj:newFlowerData,
    }

    axios.put(`http://localhost:3001/updateData/${this.state.index}`,params).then(
      result=>{
        this.setState({
          favFlowersArr:result.data
        })
      }
    )

  }

  render() {
    return (
      <>
        <h1>My Favorite Flowers</h1>
        {this.state.showModel && 
        <Modal show={this.state.showModel} onHide={this.closeModel}>
        <Modal.Header closeButton>
          <Modal.Title>Update Form</Modal.Title>
        </Modal.Header>
        <form onSubmit={this.submitUpdate}>
          <label>Name:</label>
          <input type='text' defaultValue={this.state.flowerName}></input>
          <label>Photo URL:</label>
          <input type='text' defaultValue={this.state.flowerPhoto}></input>
          <label>Instructions</label>
          <input type='text' defaultValue={this.state.flowerinstructions}></input>
          <input type='submit' value="update"></input>
        </form>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.closeModel}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>}

        {this.state.favFlowersArr.length && this.state.favFlowersArr.map((flower, idx) => {
          return (
            <Card style={{ width: '20rem', display: 'inline-block' }}>
              <Card.Title>{flower.name}</Card.Title>
              <img src={flower.photo} style={{ width: '20rem' }} />
              <Card.Body>{flower.instructions}</Card.Body>
              <Button onClick={()=>{this.deleteFlower(idx)}} >Delete</Button>
              <Button onClick={()=>{this.updateFlower(flower,idx)}}>Update</Button>
            </Card>)
        })}
      </>
    )
  }
}

export default withAuth0(FavFlowers);
