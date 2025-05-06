
export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	
	return (
		// Auth [[ Find at scss/framework/auth.scss ]]
		<div className='auth py-5'>
			<div className='container'>
				<div className='row'>
					<div className='col-xl-5 col-lg-7 col-md-9 col-sm-11 mx-auto'>
						<div className='card'>
							<div className='card-body p-sm-5'>
								{children}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
