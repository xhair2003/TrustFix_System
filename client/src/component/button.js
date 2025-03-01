const Button = ({ children, ...props }) => {
    return (
        <button className="bg-blue-600 text-white border-none py-2 px-4 rounded cursor-pointer text-lg transition duration-300 hover:bg-blue-700" {...props}>
            {children}
        </button>
    );
}

export default Button