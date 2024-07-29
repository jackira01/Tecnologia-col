import { diffDays, format } from "@formkit/tempo"
const currentDate = new Date()
export const initialValues = [
    {
        id: 1,
        imageURL: "https://asset.msi.com/resize/image/global/product/product_1684823634257687253fc3e0a9d76228ea118402bc.png62405b38c58fe0f07fcef2367d8a9ba1/400.png",
        name: " MSI Stealth series x Mercedes-AMG Motorsport ",
        ram: {
            size: "8",
            type: "DDR3"
        },
        storage: {
            size: "500 GB",
            type: "SSD"
        },
        cpu: "intel celeron n4000"
    },
    {
        id: 2,
        imageURL: "https://asset.msi.com/resize/image/global/product/product_1684823634257687253fc3e0a9d76228ea118402bc.png62405b38c58fe0f07fcef2367d8a9ba1/400.png",
        name: " MSI Stealth series x Mercedes-AMG Motorsport ",
        ram: {
            size: "8",
            type: "DDR3"
        },
        storage: {
            size: "500 GB",
            type: "SSD"
        },
        cpu: "intel celeron n4000"
    },
    {
        id: 3,
        imageURL: "https://asset.msi.com/resize/image/global/product/product_1684823634257687253fc3e0a9d76228ea118402bc.png62405b38c58fe0f07fcef2367d8a9ba1/400.png",
        name: " MSI Stealth series x Mercedes-AMG Motorsport ",
        ram: {
            size: "8",
            type: "DDR3"
        },
        storage: {
            size: "500 GB",
            type: "SSD"
        },
        cpu: "intel celeron n4000"
    },
    {
        id: 4,
        imageURL: "https://asset.msi.com/resize/image/global/product/product_1684823634257687253fc3e0a9d76228ea118402bc.png62405b38c58fe0f07fcef2367d8a9ba1/400.png",
        name: " MSI Stealth series x Mercedes-AMG Motorsport ",
        ram: {
            size: "8",
            type: "DDR3"
        },
        storage: {
            size: "500 GB",
            type: "SSD"
        },
        cpu: "intel celeron n4000"
    }
]

export const parseData = (data) => (
    {
        name: data.name,
        price: {
            minimun: data.price_minimun,
            buy: data.price_buy,
            sale: data.price_sale,
        },
        image_URL: data.imageUrl,
        specification: {
            specification_URL: data.specification_URL,
            product_status: data.pruduct_status,
            charger: data.charger,
            battery: data.battery,
            so: data.so,
            brand: data.brand,
            screen_size: data.screen_size,
            ram: {
                size: data.ram_size,
                ram_type: data.ram_type,
            },
            storage: {
                size: data.storage_size,
                storage_type: data.storage_type,
            },
            cpu: {
                brand: data.cpu_brand,
                model: data.cpu_model,
            },
            general_description: data.description,
        },
    }
)

export const parseDate = (date) => {
    const parseDate = format(currentDate, "YYYY-MM-DD", "es")
    const diff = diffDays( parseDate, date)
    const dia = diff >= 10 ? "Dias" : "Dia"
    return `${parseDate} ( ${diff} ${dia} )`
}

export const defaultValuesForm = {
    name: "",
    price_minimun: "0",
    price_sale: "0",
    imageUrl: "0",
    product_status: "nuevo",
    so: "windows 7",
    ram_size: "2GB",
    ram_type: "DDR2",
    storage_size: "128GB",
    storage_type: "SSD",
    cpu_brand: "",
    cpu_model: "",
    brand: "",
    charger: true,
    battery: true,
    screen_size: "",
    specification_URL: "",
    description: "",
    price_buy: "",
}