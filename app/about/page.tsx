import Navbar from "@/components/navbar"
import SpaceBackground from "@/components/space-background"


export default function AboutPage() {
  return (
    <main className="relative min-h-dvh">
      {/* Space background as a fixed, full-page background */}
  <SpaceBackground />
      <Navbar />
  <div className="min-h-dvh flex items-center justify-center p-8 mt-20">
        <div className="max-w-4xl w-full space-y-6">
          {/* Hero Section */}
          <div className="rounded-xl bg-black/80 border border-white/10 p-8 backdrop-blur">
            <h1 className="text-4xl font-bold text-white mb-4">
              Multimessenger Astronomy Correlation Platform
            </h1>
            <p className="text-xl text-cyan-300 mb-6">
              Advanced gravitational wave and gamma-ray burst correlation analysis using machine learning and KD-tree algorithms
            </p>
            <p className="text-white/80 text-lg leading-relaxed">
              Developed by <strong className="text-cyan-300">Team Blueberry</strong> for the CTRL Space competition, 
              this platform represents a breakthrough in multimessenger astronomy research, enabling real-time 
              correlation of cosmic events to unlock the secrets of the universe.
            </p>
          </div>

          {/* Project Overview */}
          <div className="rounded-xl bg-black/80 border border-white/10 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
              Project Overview
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              Our platform addresses one of the most challenging problems in modern astrophysics: identifying 
              correlations between different types of cosmic events in real-time. By analyzing gravitational 
              wave detections from LIGO-Virgo and gamma-ray bursts from various space observatories, we can 
              identify potential multimessenger events that provide unprecedented insights into cosmic phenomena.
            </p>
            <p className="text-white/80 leading-relaxed">
              The famous <strong className="text-amber-300">GW170817</strong> event, which we successfully 
              detect and correlate in our system, marked the beginning of multimessenger astronomy - providing 
              the first confirmed observation of a neutron star merger through both gravitational waves and 
              electromagnetic radiation.
            </p>
          </div>

          {/* System Architecture & Methodology */}
          <div className="rounded-xl bg-black/80 border border-purple-400/20 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              System Architecture & Methodology
            </h2>
            <div className="space-y-4">
              <p className="text-white/80 leading-relaxed">
                Our platform is built on a robust, modular pipeline inspired by the CTRL Space Team Blueberry system design. The architecture is divided into distinct phases, each responsible for a critical aspect of multimessenger event correlation:
              </p>
              <ol className="list-decimal list-inside text-white/80 space-y-2">
                <li>
                  <strong className="text-cyan-300">Dynamic Configuration Engine:</strong> Provides adaptive search parameters for each event type (e.g., GW, GRB, Optical), enabling physically-motivated, domain-aware candidate selection. This engine uses expert-tuned values for time and spatial windows, ensuring efficient and relevant searches.
                </li>
                <li>
                  <strong className="text-cyan-300">Standardized Data Ingestion:</strong> Fetches and transforms raw data from multiple sources (GWOSC, HEASARC, ZTF, etc.) into a unified schema. All events are standardized with fields like event_id, source, event_type, utc_time, ra_deg, dec_deg, pos_error_deg, and signal_strength, allowing seamless cross-catalog analysis.
                </li>
                <li>
                  <strong className="text-cyan-300">Adaptive Candidate Search:</strong> Implements a time-windowed, spatially-aware search for event pairs, using the configuration engine to set dynamic search radii and time windows. This dramatically reduces false positives and computational waste, focusing only on physically plausible event pairs.
                </li>
                <li>
                  <strong className="text-cyan-300">Multi-Factor Scoring Engine:</strong> Each candidate pair is scored using a transparent, physics-based approach:
                  <ul className="list-disc ml-6 mt-1 space-y-1">
                    <li><strong>Spatio-Temporal Score:</strong> Combines spatial and temporal alignment using exponential decay functions, rewarding close matches in both space and time.</li>
                    <li><strong>Significance Score:</strong> Uses percentile ranking to normalize signal strengths across event types, ensuring fair comparison between, e.g., GW and GRB events.</li>
                    <li><strong>Contextual Score:</strong> Assesses astrophysical plausibility, such as the presence of a host galaxy at the event location.</li>
                  </ul>
                  The final <span className="text-green-300 font-semibold">confidence_score</span> is a weighted sum of these sub-scores, prioritizing spatio-temporal alignment, then signal strength, then context.
                </li>
              </ol>
              <p className="text-white/80 leading-relaxed mt-4">
                This white-box, physics-driven methodology ensures that our results are interpretable, robust, and scientifically meaningful—avoiding the pitfalls of black-box AI. The system is designed for extensibility, allowing new event types and data sources to be integrated with minimal changes.
              </p>
              <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-6 border border-purple-500/20 mt-4">
                <h3 className="text-lg font-medium text-cyan-300 mb-2">Key Features & Innovations</h3>
                <ul className="text-white/80 space-y-1">
                  <li>• Adaptive, domain-aware configuration for each event type</li>
                  <li>• Unified, standardized data ingestion from multiple catalogs</li>
                  <li>• Efficient, physically-motivated candidate search algorithm</li>
                  <li>• Multi-factor, transparent scoring system for robust confidence estimation</li>
                  <li>• Extensible design for future event types and data sources</li>
                  <li>• Comprehensive error handling and quality assurance</li>
                  <li>• Interactive visualization and reporting for scientific analysis</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Correlation Algorithm */}
          <div className="rounded-xl bg-black/80 border border-white/10 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
              Advanced Correlation Algorithm
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              Our correlation system employs a sophisticated <strong className="text-green-300">MultimessengerCorrelator</strong> 
              that uses KD-tree spatial indexing for efficient astronomical coordinate matching. The algorithm evaluates 
              correlations based on three weighted criteria:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-cyan-300 font-medium mb-2">Temporal Correlation (50%)</h4>
                <p className="text-white/70 text-sm">
                  Time difference analysis with exponential decay scoring, considering arrival time delays 
                  from cosmic events traveling at the speed of light.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-purple-300 font-medium mb-2">Spatial Correlation (30%)</h4>
                <p className="text-white/70 text-sm">
                  Angular separation calculation using spherical coordinates, accounting for detector 
                  position uncertainties and error circles.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-amber-300 font-medium mb-2">Significance Score (20%)</h4>
                <p className="text-white/70 text-sm">
                  Signal strength evaluation considering SNR for gravitational waves and flux 
                  measurements for gamma-ray bursts.
                </p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              The system guarantees identification of the top correlations through adaptive parameter expansion, 
              ensuring robust detection even for weak or distant events.
            </p>
          </div>

          {/* Data Sources */}
          <div className="rounded-xl bg-black/80 border border-white/10 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-amber-400 rounded-full mr-3"></span>
              Data Sources & Coverage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-cyan-300 mb-3">Gravitational Wave Events (GWOSC)</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-2">
                      Our GWOSC dataset includes <strong>90 confirmed GW events</strong> compiled from the official LIGO–Virgo catalogs (GWTC-1, GWTC-2.1, GWTC-3) and spans observations from the landmark detection <strong>GW150914 (2015)</strong> through recent events. The events include both binary black hole mergers and neutron star mergers.
                    </p>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• Data sourced from LIGO–Virgo Open Science Center (GWOSC) catalogs</li>
                      <li>• Covers events from 2015 to 2023</li>
                      <li>• Binary black hole and neutron star mergers</li>
                      <li>• Position data provided where available, though most events lack precise sky localization</li>
                      <li>• Signal-to-noise ratios (SNR) range from 4.5 to 33</li>
                    </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-purple-400 mb-3">Gamma-Ray Burst Events  (HEASARC)</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-2">
                    Our HEASARC dataset compiles <strong>~11,000 GRB events</strong> from the <em>SwiftGRB</em> and <em>GRBCAT</em> archives. It spans detections from the 1960s through the modern Swift era, covering both historical bursts and recent well-localized events.
                  </p>
                  <ul className="text-white/70 text-sm space-y-1 mb-2">
                    <li>• Data sourced from <em>HEASARC SwiftGRB</em> and <em>GRBCAT</em> catalogs</li>
                    <li>• Covers events from 1967 to recent years</li>
                    <li>• Positions available for ~6,800 bursts, with RA/Dec provided where measured</li>
                    <li>• <em>Positional uncertainties</em> (pos_error_deg) assigned with realistic values:</li>
                  </ul>
                  <ul className="text-white/70 text-sm ml-4 list-disc space-y-1 mb-2">
                    <li>Swift BAT: ~0.02–0.07° (arcmin-scale)</li>
                    <li>Historical GRBs: ~0.5–2° (large error boxes)</li>
                    <li>Transitional (2000s): ~0.1–0.5°</li>
                  </ul>
                  <p className="text-white/70 text-sm">
                    • <em>Signal strength</em> normalized (0–1), derived from peak flux/fluence when available.
                  </p>

              </div>
              <div>
                <h3 className="text-lg font-medium text-rose-500 mb-3">Transient Name Server (TNS) Events</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-2">
                  Our TNS dataset contains <em>hundreds of confirmed transient and supernova events</em>, obtained from the official IAU Transient Name Server and standardized from parquet to CSV for analysis. These events include a wide variety of astronomical transients such as <strong>Astronomical Transients (AT)</strong>, <strong>Type II Supernovae (SN II)</strong>, and <strong>Type Ic Supernovae (SN Ic)</strong>, with discovery dates spanning multiple years.
                </p>
                <ul className="text-white/70 text-sm space-y-1 mb-2">
                  <li>• Official IAU Transient Name Server (TNS) catalog</li>
                  <li>• Event classes include AT, SN II, SN Ic, and others</li>
                  <li>• Sky positions (RA, Dec) provided with arcsecond-level precision</li>
                  <li>• Positional uncertainties typically ~5.6×10⁻⁵° (≃0.2 arcsec) for most entries</li>
                  <li>• Reported magnitudes / signal strengths range from ~18 to ~27</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-green-500 mb-3">VizieR Catalog Events (Vizier/Other Archives)</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-2">
                  Our VizieR dataset compiles <em>astrophysical transient events</em> from multiple archival catalogs, standardized into a clean format for analysis and cross-correlation.
                </p>
                <ul className="text-white/70 text-sm space-y-1 mb-2">
                  <li>• Data sourced from VizieR online service and associated catalogs</li>
                  <li>• Includes positions (RA/Dec) with calibrated uncertainties</li>
                  <li>• Event coverage spans multiple decades of astronomical surveys</li>
                  <li>• Parameters include fluxes, magnitudes, and derived uncertainties</li>
                  <li>• Cleaned and harmonized into a structured CSV format for research use</li>
                </ul>
                <p className="text-white/70 text-sm">
                  This dataset provides a unified, machine-readable collection of transient event parameters, enabling integration with GW and GRB datasets for multi-messenger astrophysics studies.
                </p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="rounded-xl bg-black/80 border border-white/10 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-rose-400 rounded-full mr-3"></span>
              Platform Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20">
                <h4 className="text-cyan-300 font-medium mb-2">🕒 Real-time Analysis</h4>
                <p className="text-white/70 text-sm">
                  Sub-second correlation analysis with adaptive time windows from hours to months
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                <h4 className="text-purple-300 font-medium mb-2">🗂️ Interactive Timeline</h4>
                <p className="text-white/70 text-sm">
                  Circular timeline interface for exploring events across multiple years (2015-2025)
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                <h4 className="text-green-300 font-medium mb-2">📊 Confidence Scoring</h4>
                <p className="text-white/70 text-sm">
                  Multi-factor confidence scores with detailed breakdown of correlation metrics
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg p-4 border border-amber-500/20">
                <h4 className="text-amber-300 font-medium mb-2">🎯 Spatial Accuracy</h4>
                <p className="text-white/70 text-sm">
                  Precise angular separation calculations with error circle validation
                </p>
              </div>
              <div className="bg-gradient-to-br from-rose-500/10 to-red-500/10 rounded-lg p-4 border border-rose-500/20">
                <h4 className="text-rose-300 font-medium mb-2">🔒 Admin Dashboard</h4>
                <p className="text-white/70 text-sm">
                  Secure administrative interface for data management and system monitoring
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-lg p-4 border border-indigo-500/20">
                <h4 className="text-indigo-300 font-medium mb-2">📡 REST API</h4>
                <p className="text-white/70 text-sm">
                  Comprehensive API endpoints for correlation analysis and data retrieval
                </p>
              </div>
            </div>
          </div>

          {/* Impact & Future */}
          <div className="rounded-xl bg-black/80 border border-white/10 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
              Scientific Impact & Future Development
            </h2>
            <p className="text-white/80 mb-4 leading-relaxed">
              This platform represents a significant advancement in multimessenger astronomy research, providing 
              tools that can accelerate the discovery of cosmic phenomena. Our correlation algorithms have 
              successfully identified the historic <strong className="text-amber-300">GW170817-GRB170817A </strong> 
              correlation, demonstrating the system's capability to detect genuine multimessenger events.
            </p>
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-6 border border-cyan-500/20">
              <h3 className="text-lg font-medium text-cyan-300 mb-3">🚀 Future Enhancements</h3>
              <ul className="text-white/80 space-y-2">
                <li>• Integration with next-generation gravitational wave detectors (KAGRA, Einstein Telescope)</li>
                <li>• Machine learning models for automated event classification and significance assessment</li>
                <li>• Real-time alert system for immediate follow-up observations</li>
                <li>• Extended coverage to include neutrino detections and optical transients</li>
                <li>• Collaborative features for international research team coordination</li>
              </ul>
            </div>
          </div>

          {/* Team & Competition */}
          <div className="rounded-xl bg-black/80 border border-white/10 p-8 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              About Team Blueberry
            </h2>
            <h1 className="text-white/80 mb-4 leading-relaxed">Members: <b>Shivaprasad Gowda, Rudra Pratap Singh, Yash Verdhan, Vedansh Madan, Nakul Bhadade</b></h1>
            <p className="text-white/80 mb-4 leading-relaxed">
              Team Blueberry developed this platform as part of the <strong className="text-purple-300">CTRL Space </strong> 
              competition, demonstrating our commitment to advancing space technology and astronomical research. 
              Our multidisciplinary team combines expertise in astrophysics, software engineering, and data science 
              to create innovative solutions for the space research community.
            </p>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/20">
              <p className="text-white/80 text-center italic">
                "Pushing the boundaries of multimessenger astronomy through innovative technology and collaborative research"
              </p>
              <p className="text-purple-300 text-center font-medium mt-2">— Team Blueberry</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
