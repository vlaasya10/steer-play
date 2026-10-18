import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { entertainmentAds } from '../data/entertainmentAds';
import Artwork from './Artwork';

export default function EntertainmentDemo() {
  return <section className="entertainment-demo" aria-labelledby="entertainment-demo-title"><div className="eyebrow">THREE MORE WAYS TO GET CURIOUS</div><h2 id="entertainment-demo-title">Different hooks. Meaningful discoveries.</h2><p>Three complete games, each with its own simulated Reel. All handoffs remain optional.</p><div>{entertainmentAds.map(ad => <article key={ad.id}><Artwork kind={ad.art} /><h3>{ad.title}</h3><p>{ad.audience}</p><Link className="text-link" to={ad.adRoute}>Preview Reel <ArrowUpRight size={15} /></Link><Link className="text-link" to={ad.playRoute}>Play game <ArrowRight size={15} /></Link></article>)}</div></section>;
}
