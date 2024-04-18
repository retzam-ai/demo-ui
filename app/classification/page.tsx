import Link from 'next/link';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        Supervised Learning Classification Models
      </h1>

      <p>
        This section aims to illustrate classification in supervised learning
        models.
      </p>
      <p>
        This shows the precision, recall and accuracy of the models. <br />
        It also shows prediction results for each model.
      </p>
      <p>We have a few demo projects </p>

      <ul>
        <li>
          Classification models that predicts the manufacturer of a car based on
          some features. <br />
          Try it <Link href="classification/cars">here</Link>
        </li>
        <li>
          Classification models that predicts whether a football player would be
          injured in their next match. <br />
          Try it <Link href="classification/injury">here</Link>
        </li>
      </ul>
    </div>
  );
}
