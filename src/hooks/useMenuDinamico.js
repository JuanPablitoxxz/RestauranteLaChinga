import { useState, useEffect } from 'react'

export const useMenuDinamico = () => {
  const [menuActual, setMenuActual] = useState(null)
  const [horaActual, setHoraActual] = useState(new Date())

  useEffect(() => {
    // Actualizar la hora cada minuto
    const interval = setInterval(() => {
      setHoraActual(new Date())
    }, 60000) // 60 segundos

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const hora = horaActual.getHours()
    const minutos = horaActual.getMinutes()
    const horaCompleta = hora + (minutos / 60)

    // Definir horarios de los menús
    const horariosMenus = {
      desayuno: { inicio: 7, fin: 11 },
      almuerzo: { inicio: 12, fin: 15 },
      drinks_manana: { inicio: 10, fin: 14 },
      drinks_tarde: { inicio: 15, fin: 19 },
      cena: { inicio: 19, fin: 23 }
    }

    // Determinar qué menú está activo
    let menuActivo = null

    if (horaCompleta >= horariosMenus.desayuno.inicio && horaCompleta < horariosMenus.desayuno.fin) {
      menuActivo = 'desayuno'
    } else if (horaCompleta >= horariosMenus.almuerzo.inicio && horaCompleta < horariosMenus.almuerzo.fin) {
      menuActivo = 'almuerzo'
    } else if (horaCompleta >= horariosMenus.drinks_manana.inicio && horaCompleta < horariosMenus.drinks_manana.fin) {
      menuActivo = 'drinks_manana'
    } else if (horaCompleta >= horariosMenus.drinks_tarde.inicio && horaCompleta < horariosMenus.drinks_tarde.fin) {
      menuActivo = 'drinks_tarde'
    } else if (horaCompleta >= horariosMenus.cena.inicio && horaCompleta < horariosMenus.cena.fin) {
      menuActivo = 'cena'
    }

    setMenuActual(menuActivo)
  }, [horaActual])

  const obtenerNombreMenu = (tipoMenu) => {
    const nombres = {
      desayuno: 'Desayuno',
      almuerzo: 'Almuerzo',
      drinks_manana: 'Bebidas Matutinas',
      drinks_tarde: 'Bebidas Vespertinas',
      cena: 'Cena'
    }
    return nombres[tipoMenu] || 'Menú'
  }

  const obtenerProximoMenu = () => {
    const hora = horaActual.getHours()
    const minutos = horaActual.getMinutes()
    const horaCompleta = hora + (minutos / 60)

    if (horaCompleta < 7) return { menu: 'desayuno', hora: '7:00' }
    if (horaCompleta < 10) return { menu: 'drinks_manana', hora: '10:00' }
    if (horaCompleta < 12) return { menu: 'almuerzo', hora: '12:00' }
    if (horaCompleta < 15) return { menu: 'drinks_tarde', hora: '15:00' }
    if (horaCompleta < 19) return { menu: 'cena', hora: '19:00' }
    return { menu: 'desayuno', hora: '7:00 (mañana)' }
  }

  return {
    menuActual,
    horaActual,
    obtenerNombreMenu,
    obtenerProximoMenu,
    esHorarioValido: menuActual !== null
  }
}
