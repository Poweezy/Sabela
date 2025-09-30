import React from 'react';

export const metadata = {
  title: 'Who We Are - The Climate Watch',
  description: 'We are an Eswatini-based climate change NGO focused on community-driven climate action, advocacy, and education.',
};

export default function WhoWeArePage() {
  return (
    <section aria-label="Who We Are Section" className="who-we-are-section">
      <h1>Who We Are</h1>
      <p>
        We are an Eswatini-based climate change NGO, grounded in local realities and communities. 
        Our mission is to drive climate action through advocacy, education, and policy change, 
        focusing on adaptation and mitigation strategies that align with local priorities.
      </p>
      <div className="values-grid">
        <div className="value-card">
          <h2>Climate Justice</h2>
          <p>Fighting for equitable climate solutions that protect the most vulnerable communities in Eswatini.</p>
        </div>
        <div className="value-card">
          <h2>Community-Led</h2>
          <p>Locally-driven solutions and collaboration that empower communities to lead their own climate adaptation.</p>
        </div>
        <div className="value-card">
          <h2>Scientific Integrity</h2>
          <p>Evidence-based climate action grounded in the latest research and traditional knowledge systems.</p>
        </div>
      </div>
    </section>
  );
}
