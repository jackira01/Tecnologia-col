export default function AboutUs() {
    return (
        <dev class="container transition-colors duration-500 mx-auto px-6 py-12 max-w-4xl">
            {/* quienes somos */}
            <section class="transition-colors duration-500 mb-12 bg-mainLight-card dark:bg-mainDark-card rounded-lg shadow-md p-8 text-gray-700 dark:text-mainDark-white">
                <h2 class="text-2xl font-bold text-blue-800 dark:dark:text-mainDark-text mb-4">¿Quiénes Somos?</h2>
                <p class="mb-4">
                    Con más de <span class="font-semibold text-blue-600 dark:text-mainDark-text">30 años de experiencia</span> en el mercado, Tecnologia Col se ha consolidado como líder en Ibagué, Tolima, en la venta de equipos informáticos de segunda mano y servicios técnicos especializados.
                </p>
                <p class="text-gray-700 dark:text-mainDark-white">
                    Nuestra misión es <span class="font-semibold text-blue-600 dark:text-mainDark-text">brindar equipos y servicios garantizados</span>, de buena calidad y completamente funcionales, a precios accesibles para toda la comunidad.
                </p>
            </section>

            {/* Servicios */}
            <section class="transition-colors duration-500 mb-12 bg-mainLight-card dark:bg-mainDark-card rounded-lg shadow-md p-8">
                <h2 class="text-2xl font-bold text-blue-800 dark:text-mainDark-text mb-6">Nuestros Servicios</h2>
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="transition-colors duration-500 bg-blue-50 dark:bg-mainDark-bg p-6 rounded-lg">
                        <h3 class="font-bold text-lg text-blue-700 dark:text-mainDark-text mb-2">Venta de Equipos</h3>
                        <ul class="list-disc pl-5 text-gray-700 dark:text-mainDark-white space-y-1">
                            <li>Portátiles usados garantizados</li>
                            <li>Equipos de escritorio reacondicionados</li>
                            <li>Componentes y accesorios</li>
                        </ul>
                    </div>
                    <div class="transition-colors duration-500 bg-blue-50 dark:bg-mainDark-bg p-6 rounded-lg">
                        <h3 class="font-bold text-lg text-blue-700 dark:text-mainDark-text mb-2">Servicios Técnicos</h3>
                        <ul class="list-disc pl-5 text-gray-700 dark:text-mainDark-white space-y-1">
                            <li>Mantenimiento preventivo y correctivo</li>
                            <li>Formateo e instalación de Windows</li>
                            <li>Recuperación de datos y contraseñas</li>
                            <li>Actualización de hardware</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Mapa de Ubicación */}
            <section class="transition-colors duration-500 bg-white dark:bg-mainDark-card rounded-lg shadow-md p-8">
                <h2 class="text-2xl font-bold text-blue-800 dark:text-mainDark-text mb-4">Nuestra Ubicación</h2>
                <p class="text-gray-700 dark:text-mainDark-white mb-6">
                    Estamos ubicados en <span class="font-semibold text-blue-600 dark:text-mainDark-text">Ibagué, Tolima</span>, atendiendo tanto a particulares como a pequeñas empresas con la misma calidad y compromiso que nos ha caracterizado por más de tres décadas.
                </p>
            </section>
        </dev>
    )
}