import Link from 'next/link';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">Supervised Learning Models</h1>

      <p>This section aims to illustrate supervised learning models.</p>
      <p>
        This shows the precision, recall and accuracy of the models. <br />
        It also shows prediction results for each model.
      </p>
      <p>We have a few demo projects </p>

      <ul>
        <li>
          Supervised learning models that predicts the manufacturer of a car
          based on some features. <br />
          Try it <Link href="supervised-learning/cars">here</Link>
        </li>
      </ul>
    </div>
  );
}
