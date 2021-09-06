import React from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

const Home = () => {
  return (
    <Container className='mx-auto'>
      <div className='d-flex flex-column text-center'>
        <h1>Hello Scrum masters</h1>
        <Button className='mx-auto'>Hola</Button>
      </div>
    </Container>
  )
}

export default Home
