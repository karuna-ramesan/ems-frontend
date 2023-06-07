import React from 'react'
import { Container, Navbar } from 'react-bootstrap'


function Header() {
  return (
    <Navbar bg="primary" variant="dark">
    <Container>
      <Navbar.Brand className='fs-3' href="/">
            <i class="fa-sharp fa-solid fa-layer-group me-1"></i>EMS APPLICATION 
      </Navbar.Brand>
    </Container>
  </Navbar>
    
  )
}

export default Header
