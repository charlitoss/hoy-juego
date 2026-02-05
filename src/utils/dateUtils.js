/**
 * Date formatting utilities
 */

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthsFull = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  return {
    dayName: days[date.getDay()],
    dayShort: days[date.getDay()].slice(0, 3),
    short: `${days[date.getDay()].slice(0, 3)} ${date.getDate()} ${months[date.getMonth()]}`,
    full: `${days[date.getDay()]} ${date.getDate()} de ${monthsFull[date.getMonth()]}, ${date.getFullYear()}`
  };
};

export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};
