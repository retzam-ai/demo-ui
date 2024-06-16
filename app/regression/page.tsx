import Link from 'next/link';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">
        Supervised Learning Regression Models
      </h1>

      <p>
        This section aims to illustrate regression in supervised learning
        models.
      </p>
      <p>
        This shows the accuracy, bias and variance of the models. <br />
        It also shows prediction results for each model.
      </p>
      <p>We have a demo project </p>

      <ul>
        <li>
          Regression models that predicts the price of a house based on some
          features. <br />
          Try it <Link href="regression/houses">here</Link>
        </li>
      </ul>
    </div>
  );
}
