import React, { useState, useEffect } from 'react';
import './style.css';
import ImageResize from 'image-resize';
import useEffect from 'react/hooks';
import { useForm } from 'react-hook-form';

// import ImageResize from '../ImageResize';
// import { sleep } from './libs';
// import './index.css';
function GithubLogo() {
  return (
    <>
      <a
        href="https://github.com/kode-team/image-resize"
        target="_blank"
        class="github-corner"
      >
        <svg width="80" height="80" viewBox="0 0 250 250">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor"
            class="octo-arm"
          ></path>
          <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor"
            class="octo-body"
          ></path>
        </svg>
      </a>
    </>
  );
}
export default function App() {
  useEffect(() => {
    const imageResize = new ImageResize();
    const $form = document.getElementById('form');
    const $result = document.getElementById('result');
    const p = console.log;
    // p($form);
    // p($result);
    const values = new Proxy(
      {},
      {
        get: (obj, name) => obj[name],
        set: (obj, prop, value) => {
          switch (prop) {
            case 'width':
            case 'height':
            case 'quality':
            case 'reSample':
              value = Number(value);
              break;
          }
          obj[prop] = value;
          return true;
        },
      }
    );

    /**
     * functions
     */

    async function onSubmitForm(e) {
      e.preventDefault();

      // set values
      const $self = e.target;
      const $fields = $self.querySelectorAll('[name]');
      for (const $item of $fields) {
        values[$item.name] = $item.value;
      }
      console.log(values);
      // set source
      let src;
      if (values.upload) {
        src = $self.querySelector('[name=upload]'); // set element
        src = src.files[0]; // set File
        src = new Blob([src], { type: src.type }); // set Blob
      } else if (values.url) {
        src = values.url;
      } else {
        alert('not found source');
        return false;
      }

      // empty result
      $result.innerHTML = '';

      try {
        // basic resize
        // let res = await imageResize.updateOptions(values).play(src);
        // completeResizeImage(res);
        compressToSize(src, 210);
        // advanced resize
        // let res = await imageResize.updateOptions(values).get(src);
        // res = await imageResize.resize(res);
        // res = await ready(res);
        // res = await imageResize.output(res);
        // completeResizeImage(res);
      } catch (e) {
        errorResizeImage(e);
      }
    }

    // ready
    async function ready(canvas) {
      return await setTimeout(() => {
        console.warn('ready:', imageResize.options);
        return canvas;
      }, 1000);
    }

    function completeResizeImage(res) {
      switch (imageResize.options.outputType) {
        case 'base64':
          var image = new Image();
          image.src = res;
          p(res.length / 1024);
          $result.appendChild(image);
          break;
        case 'canvas':
          $result.appendChild(res);
          break;
        case 'blob':
        default:
          console.log('RESULT:', res);
          break;
      }
    }

    function compressToSize(data, maxSize) {
      let i = new Image();
      i.src = data;
      i.onload = async (ei) => {
        // p(ei);

        for (let x = 99; x > 1; x--) {
          values.quality = x / 100;
          values.width = i.width;
          values.outputType = 'blob';
          let res = await imageResize.updateOptions(values).play(data);
          let cs = res.size / 1024;
          p(x, cs);
          if (cs < maxSize) {
            values.outputType = 'base64';
            let res = await imageResize.updateOptions(values).play(data);

            completeResizeImage(res);

            break;
          }
        }
      };
    }

    function errorResizeImage(e) {
      console.error('ERROR EVENT', e);
      alert(`Error resize: ${e.message}`);
    }

    // action
    $form.addEventListener('submit', onSubmitForm);
  }, []);

  // const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <main>
        <header class="header">
          {/* <h1 class="header__title">Image Resize demo</h1> */}
        </header>
        <form
          method="post"
          id="form"
          class="form"
          // onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset class="form__fieldset">
            <legend>설정 옵션들</legend>
            <div class="form__body">
              <div class="field">
                <p class="field__label">
                  <label for="form_url">URL</label>
                </p>
                <div class="field__body">
                  <input
                    type="text"
                    name="url"
                    id="form_url"
                    placeholder="http://url/image.jpg"
                    value="https://goose.redgoose.me/data/upload/original/201906/rg3120.jpg"
                    class="input-text input-text--block"
                    // ref={register({ required: true })}
                    // onChange={(e)=>e.value}
                  />
                  <p class="field__description">URL of Image to fetch</p>
                </div>
              </div>
              <div class="field">
                <p class="field__label">
                  <label for="form_upload">Upload</label>
                </p>
                <div class="field__body">
                  <input
                    type="file"
                    name="upload"
                    id="form_upload"
                    class="input-file input-file--block"
                  />
                  <p class="field__description">
                    Upload file from local storage
                  </p>
                </div>
              </div>
              <div class="field">
                <p class="field__label">
                  <label for="form-width">Size</label>
                </p>
                <div class="field__body">
                  <div class="field-inlines">
                    <label class="field-inline">
                      <span>Width:</span>
                      <input
                        type="text"
                        name="width"
                        id="form-width"
                        // value="64"
                        size="5"
                        maxlength="4"
                        class="input-text"
                      />
                    </label>
                    <label class="field-inline">
                      <span>Height:</span>
                      <input
                        type="text"
                        name="height"
                        // value="0"
                        size="5"
                        maxlength="4"
                        class="input-text"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div class="field">
                <p class="field__label">
                  <label for="form_format">Options</label>
                </p>
                <div class="field__body">
                  <div class="field-inlines">
                    <label class="field-inline">
                      <span>Format:</span>
                      <select
                        name="format"
                        id="form_format"
                        class="input-select"
                      >
                        <option value="webp">webp</option>
                        <option value="jpg">jpg</option>
                        <option value="png">png</option>
                      </select>
                    </label>
                    <label class="field-inline">
                      <span>Quality:</span>
                      <input
                        type="text"
                        name="quality"
                        id="form_quality"
                        // value=".75"
                        size="5"
                        class="input-text"
                      />
                    </label>
                  </div>
                  <div class="field-inlines">
                    <label class="field-inline">
                      <span>Output:</span>
                      <select
                        name="outputType"
                        id="form_output"
                        class="input-select"
                      >
                        <option value="base64">base64</option>
                        <option value="canvas">canvas</option>
                        <option value="blob">blob</option>
                      </select>
                    </label>
                    <label class="field-inline">
                      <span>Resampling count:</span>
                      <select
                        name="reSample"
                        id="form_reSample"
                        class="input-select"
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2" selected>
                          2
                        </option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
          <nav class="form__submit">
            <button type="submit">PLAY</button>
          </nav>
        </form>
        <section class="result">
          <h1 class="result__title">Result</h1>
          <figure id="result" class="result__image">
            <img id="final_image"></img>
          </figure>
        </section>
      </main>

      {/* <GithubLogo/> */}
    </>
  );
}
