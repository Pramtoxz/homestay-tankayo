import { Head, usePage } from '@inertiajs/react';
import type { Auth } from '@/types';
import { Cta } from './welcome/cta';
import { Features } from './welcome/features';
import { Footer } from './welcome/footer';
import { Hero } from './welcome/hero';
import { Navbar } from './welcome/navbar';
import { Rooms } from './welcome/rooms';
import { Stats } from './welcome/stats';
import type { Room } from './welcome/types';

type PageProps = {
    auth: Auth;
    rooms: Room[];
};

export default function Welcome() {
    const { auth, rooms } = usePage<PageProps>().props;
    const user = auth.user ?? null;

    return (
        <>
            <Head title="Beranda">
                <meta
                    name="description"
                    content="Eco Park Syariah Tankayo — penginapan nyaman di dataran tinggi Tanah Datar, Sumatera Barat. Konsep syariah, udara sejuk pegunungan, dan pemandangan alam Minangkabau."
                />
            </Head>

            <Navbar user={user} />
            <Hero user={user} />
            <Features />
            <Rooms rooms={rooms} user={user} />
            <Stats />
            <Cta user={user} />
            <Footer />
        </>
    );
}
