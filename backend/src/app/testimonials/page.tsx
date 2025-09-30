import React from 'react';

export const metadata = {
  title: 'Community Testimonials - The Climate Watch',
  description: 'Hear from community members whose lives have been transformed through our climate action initiatives.',
};

export default function TestimonialsPage() {
  return (
    <section aria-label="Community Testimonials" className="testimonials-section">
      <h1>Community Voices</h1>
      <p>
        Hear from community members whose lives have been transformed through our climate action initiatives.
      </p>
      <div className="testimonials-grid">
        <div className="testimonial-card">
          <h2>Nomsa Dlamini</h2>
          <p className="testimonial-role">Farmer, Hhohho Region</p>
          <blockquote>
            &ldquo;The climate-smart farming techniques taught by The Climate Watch have doubled my crop yield despite the changing weather patterns. My family now has food security year-round.&rdquo;
          </blockquote>
        </div>
        <div className="testimonial-card">
          <h2>Sipho Mthembu</h2>
          <p className="testimonial-role">Youth Leader, Manzini</p>
          <blockquote>
            &ldquo;Through the youth climate leadership program, I&apos;ve learned to advocate for environmental protection in my community. We&apos;ve planted over 200 trees this year alone.&rdquo;
          </blockquote>
        </div>
        <div className="testimonial-card">
          <h2>Themba Nkomo</h2>
          <p className="testimonial-role">Solar Technician, Lubombo</p>
          <blockquote>
            &ldquo;The solar energy training program gave me skills to install and maintain solar systems. Now I help bring clean energy to rural communities while earning a sustainable income.&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
}
