import HowToUse from "@/components/HowToUse";
import SampleOutput from "@/components/SampleOutput";
import Upload from "@/components/Upload";

export default function Home() {
  return (
    <main className="relative flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 bg-black-100 text-white px-5">
      <div className="w-full max-w-7xl mt-10">
        <div id="home" className="mt-20">
          <Upload/>
        </div>
        <div id="guide" className="mt-20">
          <HowToUse/>
        </div>
        <div id="sample" className="mt-20">
          <SampleOutput/>
        </div>
      </div>
    </main>
  );
}
