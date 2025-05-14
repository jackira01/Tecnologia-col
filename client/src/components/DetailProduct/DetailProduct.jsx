import { Button } from 'flowbite-react';
import CarouselComponent from './carousel/CarouselComponent';

const DetailProduct = () => {
	return (
		<section className="py-8 md:py-16 antialiased">
			<div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
				<div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
					<CarouselComponent />

					<div className="mt-6 sm:mt-8 lg:mt-0">
						<h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
							Apple iMac 24" All-In-One Computer, Apple M1, 8GB RAM, 256GB SSD,
							Mac OS, Pink
						</h1>
						<div className="mt-4 sm:items-center sm:gap-4 sm:flex">
							<p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
								$1,249.99
							</p>
						</div>

						<div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
							<Button>Mas informacion</Button>
						</div>

						<hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

						<p className="mb-6 text-gray-500 dark:text-gray-400">
							Studio quality three mic array for crystal clear calls and voice
							recordings. Six-speaker sound system for a remarkably robust and
							high-quality audio experience. Up to 256GB of ultrafast SSD
							storage.
						</p>

						<p className="text-gray-500 dark:text-gray-400">
							Two Thunderbolt USB 4 ports and up to two USB 3 ports. Ultrafast
							Wi-Fi 6 and Bluetooth 5.0 wireless. Color matched Magic Mouse with
							Magic Keyboard or Magic Keyboard with Touch ID.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default DetailProduct;
