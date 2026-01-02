import React from 'react'
import StatCard from './StatCard'
import './StatsGrid.css'

function StatsGrid() {
  const stats = [
    {
      title: 'Total de productos',
      value: '1,245',
      icon: 'products',
      color: 'blue'
    },
    {
      title: 'Existencias mínimas',
      value: '24',
      icon: 'warning',
      color: 'yellow'
    },
    {
      title: 'Productos agotados',
      value: '12',
      icon: 'cart',
      color: 'red'
    },
    {
      title: 'Productos sin foto',
      value: '5',
      icon: 'image',
      color: 'purple'
    },
    {
      title: 'Productos sin precio',
      value: '3',
      icon: 'price',
      color: 'orange'
    },
    {
      title: 'Productos con ventas',
      value: '850',
      icon: 'trending',
      color: 'green'
    },
    {
      title: 'Productos sin ventas',
      value: '395',
      icon: 'arrow',
      color: 'gray'
    },
    {
      title: 'Sin categoría',
      value: '8',
      icon: 'category',
      color: 'indigo'
    }
  ]

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}

export default StatsGrid
