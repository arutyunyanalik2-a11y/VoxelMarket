import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./style.css";

export default function Menu() {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://voxelmarket-backend.onrender.com/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Ошибка загрузки товаров:", err));
    }, []);

    // Функция добавления товара в localStorage
    const addToCart = (product, e) => {
        e.stopPropagation();
        const cart = JSON.parse(localStorage.getItem('voxel_cart')) || [];
        const existingIndex = cart.findIndex(item => item._id === product._id);

        if (existingIndex > -1) {
            cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('voxel_cart', JSON.stringify(cart));
        alert('Товар успешно добавлен в корзину!');
    };

    const filteredProducts = Array.isArray(products) ? products.filter(product => {
        const query = (searchQuery || "").toLowerCase();
        return product.name?.toLowerCase().includes(query) || product.category?.toLowerCase().includes(query);
    }) : [];

    return (
        <div className="menu">
            <h1>{searchQuery ? `Результаты поиска: "${searchQuery}"` : "Главная страница"}</h1>

            <div className="products-list">
                {filteredProducts.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', padding: '50px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {searchQuery ? (
                            // Если поиск не дал результатов, показываем текст
                            <p style={{ margin: 0 }}>Ничего не найдено по вашему запросу...</p>
                        ) : (
                            // Если идет загрузка, показываем красивый брендированный спиннер
                            <div className="voxel-loading-container">
                                <div className="voxel-spinner">
                                    <div className="voxel-spinner-circle"></div>
                                </div>
                                <p className="voxel-loading-text">Загрузка товаров...</p>
                            </div>
                        )}
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <div
                            key={product._id}
                            className="product-card"
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p style={{ color: '#777', fontSize: '11px', margin: '2px 0' }}>Категория: {product.category}</p>
                            <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '4px 0' }}>{product.price} ֏</p>
                            <button
                                className="karzinu"
                                onClick={(e) => addToCart(product, e)}
                            >
                                В корзину
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}