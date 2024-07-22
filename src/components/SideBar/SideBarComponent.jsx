"use client"

import { Sidebar } from "flowbite-react";

const SideBarComponent = () => (
	<Sidebar className="m-" aria-label="Default sidebar example">
		<Sidebar.Items>
			<Sidebar.ItemGroup>
				<Sidebar.Item href="#">Dashboard</Sidebar.Item>
				<Sidebar.Item href="#" label="Pro" labelColor="dark">
					Kanban
				</Sidebar.Item>
				<Sidebar.Item href="#" label="3">
					Inbox
				</Sidebar.Item>
				<Sidebar.Item href="#">Users</Sidebar.Item>
				<Sidebar.Item href="#">Products</Sidebar.Item>
				<Sidebar.Item href="#">Sign In</Sidebar.Item>
				<Sidebar.Item href="#">Sign Up</Sidebar.Item>
			</Sidebar.ItemGroup>
		</Sidebar.Items>
	</Sidebar>
);

export default SideBarComponent;
