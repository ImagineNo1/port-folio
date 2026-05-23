import { motion } from "framer-motion";

import TestimonialSlider from "../../components/TestimonialSlider";
import { fadeIn } from "../../variants";

const Testimonials = ({ content }) => {
  return (
    <div className="h-full bg-primary/30 py-32 text-center">
      <div className="container mx-auto h-full flex flex-col justify-center">
        <motion.h2
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="h2 mb-8 xl:mb-0"
        >
          {content.testimonials.heading}
        </motion.h2>

        {/* slider */}
        <motion.div
          variants={fadeIn("up", 0.4)}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          <TestimonialSlider items={content.testimonials.items} />
        </motion.div>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const { getSiteContent } = await import("../../lib/contentService");
  return { props: { content: await getSiteContent() } };
}

export default Testimonials;
