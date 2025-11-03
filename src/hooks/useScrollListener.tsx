import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar si la página ha sido scrolleada más allá de un umbral.
 * @param threshold El número de píxeles a partir del cual se considera "scrolleado".
 * @returns Un booleano que indica si se ha superado el umbral de scroll.
 */
const useScrollListener = (threshold: number = 50): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Compara la posición vertical del scroll con el umbral
      const scrolled = window.scrollY > threshold;
      
      // Actualiza el estado solo si hay un cambio para evitar re-renders innecesarios
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    // Añadir el listener al evento de scroll
    window.addEventListener('scroll', handleScroll);
    
    // Función de limpieza para remover el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled, threshold]); // Dependencias del efecto

  return isScrolled;
};

export default useScrollListener;