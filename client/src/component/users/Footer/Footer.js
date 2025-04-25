import "./Footer.css";
import logo from "../../../assets/Images/logo.png";

const Footer = () => {
    return (
        <div className="container-footer">
            <div className="center-footer">
                <div className="left">
                    <div className="footer-section">
                        <img src={logo} alt="TrustFix Logo" className="footer-logo" />
                        <p className="footer-text">
                            Kết nối bạn với các chuyên gia sửa chữa lành nghề và đáng tin cậy để có các giải pháp nhanh chóng, đáng tin cậy và không rắc rối.
                        </p>
                    </div>
                </div>

                <div className="right">
                    <div className="footer-section">
                        <h2>Dịch vụ</h2>
                        <ul>
                            <li>Đặt thợ</li>
                            <li>Thanh toán</li>
                            <li>Chức năng</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h2>Hỗ trợ</h2>
                        <ul>
                            <li>Khiếu nại</li>
                            <li>Hướng dẫn</li>
                            <li>Đánh giá</li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h2 style={{ display: "flex" }}>Doanh nghiệp</h2>
                        <ul>
                            <li>Thông tin</li>
                            <li>Blog</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;





