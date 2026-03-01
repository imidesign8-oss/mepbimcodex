import Link from 'next/link';

export default function Footer() {
  return <footer className="footer"><div className="container grid grid-3">
    <div><h3>IMI DESIGN</h3><p>Modern architecture and interior design studio focused on high-performance and elegant spaces.</p>
    <p><strong>Address:</strong> S4 B Block, Colaso Arcade, Desterro, Vasco da Gama, Goa 403802</p>
    <p><strong>Phone:</strong> {process.env.NEXT_PUBLIC_PHONE_PLACEHOLDER || '+91 XXXXXXXXXX'}</p>
    <p><a href="mailto:projects@imidesign.in">projects@imidesign.in</a></p></div>
    <div><h4>Quick Links</h4><p><Link href="/">Home</Link> · <Link href="/about">About Us</Link> · <Link href="/services">Services</Link> · <Link href="/projects">Projects</Link> · <Link href="/blog">Blog</Link> · <Link href="/contact">Contact</Link></p>
    <h4>Legal</h4><p><Link href="/privacy-policy">Privacy Policy</Link> · <Link href="/terms">Terms</Link> · <Link href="/sitemap.xml">Sitemap</Link></p></div>
    <div><h4>Service Links</h4><p><Link href="/services/architecture-design">Architecture Design</Link><br/><Link href="/services/interior-design">Interior Design</Link></p>
    <p><a href="https://maps.google.com/?q=S4+B+Block,+Colaso+Arcade,+Desterro,+Vasco+da+Gama,+Goa+403802">Open in Google Maps</a></p></div>
  </div><div className="container meta">© {new Date().getFullYear()} IMI DESIGN. All rights reserved.</div></footer>;
}
