import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'
import ProductByName from './components/ProductByName'
import SearchResults from './components/SearchResults'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product-name/:name" element={<ProductByName />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Layout>
  )
}

export default App
