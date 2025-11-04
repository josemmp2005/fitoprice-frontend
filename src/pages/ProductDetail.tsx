import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "@/config/api";


export default function ProductDetail() {

    const [product, setProduct] = useState<Product | null>(null);
    const navigate = useNavigate();
    const productId = new URLSearchParams(window.location.search).get('id') || '';

    interface Product {
        id: number;
        name: string;
        product_img_url: string;
    }

    const getProduct = async (): Promise<void> => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        getProduct();
        console.log(product);
    }, []);


    return (
        <>

        </>
    )
}