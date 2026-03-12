// src/pages/Home.tsx
import { useTasks } from '../hooks/useTasks'
import { TaskForm } from '../components/TaskForm'
import { TaskItem } from '../components/TaskItem'

export function Home () {
  const { tareas, loading, error, crearTarea, actualizarTarea, eliminarTarea } =
    useTasks()

  if (loading) return <div>Cargando tareas...</div>
  if (error)   return <div style={{ color:'red' }}>Error: {error}</div>

  return (
    <div style={{ maxWidth:'800px', margin:'2rem auto', padding:'0 1rem' }}>
      <h1>📝 Mis Tareas</h1>
      <TaskForm
        onCrear={(titulo, descripcion) => crearTarea({ titulo, descripcion })}
      />

      {tareas.length === 0
        ? <p style={{ color:'#94a3b8' }}>No tienes tareas aún. ¡Crea una!</p>
        : tareas.map(t => (
            <TaskItem key={t.id} tarea={t}
              onActualizar={(id, completada) => actualizarTarea(id, { completada
})}
              onEliminar={eliminarTarea}
            />
          ))
      }

      <p style={{ color:'#94a3b8', fontSize:'0.9rem' }}>
        {tareas.filter(t => t.completada).length} / {tareas.length} completadas
      </p>
    </div>
  )
}