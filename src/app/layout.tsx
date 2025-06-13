import { type Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Providers } from './providers'
import 'swiper/scss'
import 'swiper/scss/a11y'
import 'swiper/scss/autoplay'
import 'swiper/scss/grid'
import 'swiper/scss/navigation'
import 'swiper/scss/pagination'

// Global scss
import '../../public/scss/styles.scss'

// Contexts
import Authentication from '@/core/contexts/authentication'
import Theme from '@/core/contexts/theme'
import Player from '@/core/contexts/player'

// Components
import Loading from '@/core/components/loading'
import Bootstrap from '@/core/components/bootstrap'
import Snackbar from '@/core/components/snackbar'
import MusicHeader from '@/core/components/header/music'
import MusicFooter from '@/core/components/footer/music'
import Music from '@/view/layout/music'
import AudioPlayer from '@/core/components/audio-player'
import Sidebar from '@/core/components/sidebar'
import { ToastContainer } from 'react-toastify'

// Metadata
export const metadata: Metadata = {
  title: 'Sampsira',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        {/* Favicon */}
        <link rel="icon" sizes='32x32' href="/images/logos/favicon.ico" type="image/x-icon"/>
        
        {/* IOS Touch Icons */}
        <link rel="apple-touch-icon" sizes="72x72" href="/images/logos/logo-icon-96x96" type="image/png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/images/logos/apple-icon/touch-icon-apple180x180.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logos/apple-icon/touch-icon-apple180x180.png" type="image/png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/images/logos/apple-icon/touch-icon-apple180x180.png" type="image/png" />
        
        {/* Google fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <script src="https://accounts.google.com/gcount/js" async defer></script>
      </head>
      
      <body>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Authentication>
              <Theme>
                <Bootstrap />
                <Snackbar>
                  <Player>
                    <div className="min-h-screen pb-24 relative">
                      <MusicHeader />
                      <Sidebar />
                      <Music>{children}</Music>
                      <MusicFooter />
                      <div className="fixed bottom-0 left-0 right-0 z-50">
                        <AudioPlayer />
                      </div>
                    </div>
                  </Player>
                </Snackbar>
              </Theme>
            </Authentication>
          </Providers>
        </NextIntlClientProvider>
        <ToastContainer />
      </body>
    </html>
  )
}
