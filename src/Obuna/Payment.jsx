import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./style/payment.css";
import { useSakura } from "../Home/context/context";
import { ClockLoader } from "react-spinners";
import { toast } from "react-toastify";

const plansData = {
    m1: { label: "1 Oy", price: 15000 },
    m3: { label: "3 Oy", price: 39000 },
    m6: { label: "6 Oy", price: 66000 },
    y1: { label: "1 Yil", price: 110000 },
};

export default function Payment() {
    const { user, addPayment } = useSakura();
    const { id } = useParams();
    const plan = plansData[id];

    const [loading, setLoading] = useState(false);
    const [paid, setPaid] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [cardNumber] = useState("6262 5701 1294 2711");
    const [time, settime] = useState(true)

    if (!plan) return <p>Plan topilmadi</p>;

    const handlePayment = () => {
        if (!selectedImage) return alert("Iltimos, chek rasmini yuklang! 🙏");
        if (loading || paid) return;
    
        setLoading(true);
    
        const paymentData = {
            name: user.name,
            email: user.email,
            plan: plan.label,
            price: plan.price,
            image: selectedImage,
            date: new Date().toLocaleString(),
        };
    
        setTimeout(() => {
            addPayment(paymentData);
    
            const savedPayments = JSON.parse(localStorage.getItem("payments") || "[]");
            savedPayments.push(paymentData);
            localStorage.setItem("payments", JSON.stringify(savedPayments));
    
            setPaid(true);
            setLoading(false);
        }, 2000);
    
        toast.success("Admin ga so`rov yuborildi ✅");
        settime(false);
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setSelectedImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="payment-container">
            <div className="payment-page">
                {
                    time == true ? (
                        <>
                            <h2>🎉 Obuna to‘lovi</h2>

                            <p className="plan-info">
                                <strong>{plan.label}</strong> – {plan.price.toLocaleString()} so‘m
                            </p>

                            <div className="card-karta">
                                <p>
                                    Sizning Ismingiz: <strong>{user.name}</strong><br />
                                    Sizning email: <em>{user.email}</em>
                                </p>
                                <p>
                                    Iltimos, quyidagi karta raqamiga <strong>{cardNumber}</strong> to‘lovni amalga oshiring.
                                </p>
                                <p className="note">
                                    Keyin chek rasmini pastdagi quti orqali yuklang. ✅
                                </p>
                            </div>

                            <div className="image-upload-wrapper">
                                <label htmlFor="imageUpload" className="image-upload-div">
                                    {selectedImage ? (
                                        <img src={selectedImage} alt="Chek" className="uploaded-image" />
                                    ) : (
                                        <span><i className="fa-solid fa-camera"></i> Chek rasmini yuklash uchun bosing</span>
                                    )}
                                </label>
                                <input
                                    type="file"
                                    id="imageUpload"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: "none" }}
                                />
                            </div>

                            <button
                                className={`pay-button ${loading ? "loading" : ""}`}
                                onClick={handlePayment}
                                disabled={loading || paid}
                            >
                                {loading ? (
                                    <span className="spinner"></span>
                                ) : paid ? "To‘lov amalga oshdi ✅" : "Yuborish"}
                            </button>
                        </>
                    ) : (
                        <div className="loader-wrapper" style={{ textAlign: "center", padding: "40px", color: "#fff" }}>
                            <ClockLoader color="#ffffff" size={60} />
                            <p style={{ marginTop: "20px", fontSize: "18px" }}>
                                ⏳ Iltimos, kuting... <br />
                                Admin <strong>@Im_Vox_Aeterna_Vip</strong> to‘lovni ko‘rib chiqmoqda.
                            </p>
                        </div>
                    )
                }

            </div>
        </div>
    );
}