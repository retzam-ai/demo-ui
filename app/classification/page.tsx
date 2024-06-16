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
      <p>We have a few demo projects. Classification models that predicts: </p>

      <ul>
        <li>
          The manufacturer of a car based on some features. <br />
          Try it <Link href="classification/cars">here</Link>
        </li>
        <li>
          Whether a football player would be injured in their next match. <br />
          Try it <Link href="classification/injury">here</Link>
        </li>
        <li>
          Whether a machine would fail or not. <br />
          Try it <Link href="classification/machines">here</Link>
        </li>
        <li>
          If a person would respond to marketing or not. <br />
          Try it <Link href="classification/marketing">here</Link>
        </li>
        <li>
          If a person would test positive for diabetes or not. <br />
          Try it <Link href="classification/diabetes">here</Link>
        </li>
      </ul>
    </div>
  );
}
