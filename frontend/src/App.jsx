import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { HomePage } from "./pages/HomePage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App(){
	return (
		<div>
			<Routes>
				<Route 
					path="/"
					element={
						<ProtectedRoute>
							<HomePage />
						</ProtectedRoute>
					}
				/>
				<Route 
					path="/login"
					element={<Login/>}
				/>
				<Route
					path="/register"
					element={<Register />}
				/>
			</Routes>
		</div>
	);
}

