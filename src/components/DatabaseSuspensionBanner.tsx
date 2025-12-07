/**
 * Database Suspension Banner Component
 * Displays a notification about database suspension (Spanish only)
 */

import { useState } from "react";
import { X } from "lucide-react";

export default function DatabaseSuspensionBanner() {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg animate-fade-in-custom-duration-700">
            <div className="container mx-auto px-4 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                        <h3 className="font-bold text-base sm:text-lg mb-1">
                            ⚠️ Aviso Importante
                        </h3>
                        <p className="text-sm sm:text-base opacity-95">
                            La aplicación está actualmente inactiva debido a la suspensión temporal de la base de datos. Sin embargo, la aplicación es completamente funcional y volverá a estar operativa próximamente.
                        </p>
                    </div>
                    
                    <div className="flex items-center self-end sm:self-auto">
                        <button
                            onClick={handleDismiss}
                            className="px-3 py-1.5 text-xs sm:text-sm font-medium bg-white/20 hover:bg-white/30 rounded-md transition-colors backdrop-blur-sm flex items-center gap-1"
                            aria-label="Cerrar"
                        >
                            <span className="hidden sm:inline">Cerrar</span>
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
