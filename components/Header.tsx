import Link from 'next/link';

export default function Header() {
  return (
    <header className="header">
      <div className="container nav">
        <Link href="/"><strong>IMI DESIGN</strong></Link>
        <nav className="navlinks" aria-label="Main navigation">
          {['About Us','Services','Projects','Blog','Contact Us'].map((x)=><Link key={x} href={`/${x.toLowerCase().replace(' ','-')}`.replace('about-us','about').replace('contact-us','contact')}>{x}</Link>)}
          <a className="btn" href="/contact#enquiry">Enquiry</a>
        </nav>
      </div>
    </header>
  );
}
