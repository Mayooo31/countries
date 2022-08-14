import Head from "next/head";
import Image from "next/image";
import React from "react";

import styles from "../../styles/Country.module.css";

const Country = ({ data }: any) => {
  const country = data[0];
  console.log(country);

  const curr: any = country.currencies && Object.values(country.currencies)[0];

  const converted = country.population.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  let unit;
  (() => {
    if (country.population >= 1000000000) return (unit = "billions");
    if (country.population >= 1000000) return (unit = "millions");
    if (country.population < 1000000) return (unit = "thousands");
  })();

  return (
    <div className={styles.country}>
      <Head>
        <title>Country - {country.name.common}</title>
      </Head>

      <div className={styles.country_name}>
        <h2>{country.name.official}</h2>
        <p>( {country.translations.ces.official} )</p>
      </div>
      <div className={styles.image}>
        <Image
          src={country.flags.png}
          layout="fill"
          objectFit="contain"
          priority={true}
        />
      </div>
      <div className={styles.info}>
        <p>
          Capital City: <span>{country.capital?.[0]}</span>
        </p>
        <p>
          Continents: <span>{country.continents[0]}</span>
        </p>
        <p>
          Borders:{" "}
          {!country.borders ? (
            <span>No Borders</span>
          ) : (
            country.borders.map((border: any, i: any) => {
              return (
                <span key={border}>
                  {border}
                  {country.borders.length - 1 !== i && ", "}
                </span>
              );
            })
          )}
        </p>
        <p>
          Currency:{" "}
          <span>
            {curr?.symbol} - {curr?.name}
          </span>
        </p>
        <p>
          Population:{" "}
          <span>
            {converted} {unit}
          </span>
        </p>
        <p>
          Timezones:{" "}
          {country.timezones.map((timezone: any, i: any) => {
            return (
              <span key={timezone}>
                {timezone}
                {country.timezones.length - 1 !== i && ", "}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};

export default Country;

export const getStaticProps = async (context: any) => {
  const { params } = context;

  let id;
  if (
    params.countryId.toLowerCase() === "guinea-bissau" ||
    params.countryId.toLowerCase() === "timor-leste"
  ) {
    id = params.countryId.toLowerCase();
  } else {
    id = params.countryId.toLowerCase().replaceAll("-", " ");
  }

  const response = await fetch(`https://restcountries.com/v3.1/name/${id}?fullText=true`);
  const data = await response.json();

  return {
    props: { data },
  };
};

export const getStaticPaths = async () => {
  const response = await fetch(`https://restcountries.com/v3.1/all`);
  const data = await response.json();

  return {
    paths: data.map((country: any) => {
      return {
        params: {
          countryId: `${country.name.common.toLowerCase().replaceAll(" ", "-")}`,
        },
      };
    }),
    fallback: false,
  };
};
